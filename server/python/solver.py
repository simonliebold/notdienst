import sys
import json
from pulp import LpProblem, LpVariable, LpMaximize, lpSum, value
from datetime import datetime

def get_data(data):
    works = data.get("works", [])
    employees = data.get("employees", [])
    return works, employees

def allocate(works, employees):

    problem = LpProblem("Staff_Scheduling", LpMaximize)

    # Entscheidungsvariablen für alle Kombinationen Mitarbeiter x Dienst
    works_employees = {}
    for work in works:
        for employee in employees:
            works_employees[(work['_id'], employee['short'])] = LpVariable(
                f"work_{work['_id']}_{employee['short']}", 0, 1, cat="Binary"
            )

    # Ziel: Maximiere die Anzahl an zugewiesenen Schichten
    problem += lpSum(works_employees.values()), "Maximize_Assigned_Works"

    # Dienst Start- und Endzeit
    work_times = {
        work['_id']: (
            datetime.fromisoformat(work['start']),
            datetime.fromisoformat(work['end'])
        )
        for work in works
    }

    for work in works:
        problem += lpSum(
            works_employees[(work['_id'], employee['short'])] for employee in employees
        ) <= 1, f"One_Employee_Per_Work_{work['_id']}"

    works = sorted(works, key=lambda s: s['start'])
    
    # Überlappende Schichten berechnen
    overlapping_pairs = []
    work_ids = [work['_id'] for work in works]
    for i, id1 in enumerate(work_ids):
        start1, end1 = work_times[id1]
        for j in range(i + 1, len(work_ids)):
            id2 = work_ids[j]
            start2, end2 = work_times[id2]
            if start2 >= end1:
                break
            if start1 < end2:
                overlapping_pairs.append((id1, id2))

    # Schichten berechnen, die weniger als 12 Stunden auseinander liegen
    rest_pairs = []
    for i, id1 in enumerate(work_ids):
        start1, end1 = work_times[id1]
        for j in range(i + 1, len(work_ids)):
            id2 = work_ids[j]
            start2, end2 = work_times[id2]
            if (start2 - end1).total_seconds() < 12 * 3600:
                rest_pairs.append((id1, id2))
            else:
                break

    for employee in employees:
        emp_id = employee['short']
        emp_works = [
            work for work in works
            if work['_id'] in [
                work_id for work_id, emp in works_employees.keys() if emp == emp_id
            ]
        ]
        # 1. Keine überlappenden Schichten
        for id1, id2 in overlapping_pairs:
            problem += (
                works_employees[(id1, emp_id)] + works_employees[(id2, emp_id)]
            ) <= 1, f"No_Overlap_{emp_id}_{id1}_{id2}"
            
        # 2. Wochenstunden dem Anstellungsverhältnis entsprechend
        problem += lpSum(
            works_employees[(work['_id'], emp_id)] *
            ((work_times[work['_id']][1] - work_times[work['_id']][0]).total_seconds() / 3600)
            for work in emp_works
        ) <= employee['maxHours'], f"Max_Hours_Limit_{emp_id}"
        
        problem += lpSum(
            works_employees[(work['_id'], emp_id)] *
            ((work_times[work['_id']][1] - work_times[work['_id']][0]).total_seconds() / 3600)
            for work in emp_works
        ) >= employee['minHours'], f"Min_Hours_Limit_{emp_id}"
        
        # 3. Freizeit 
        freetime_periods = [
            (
                datetime.fromisoformat(str(freetime['start'])),
                datetime.fromisoformat(str(freetime['end']))
            )
            for freetime in employee.get('freetimes', [])
        ]

        freetime_blocked_work_ids = set()
        for work_id, (start, end) in work_times.items():
            for vac_start, vac_end in freetime_periods:
                if vac_start < end and start < vac_end:
                    freetime_blocked_work_ids.add(work_id)
                    break

        for work_id in freetime_blocked_work_ids:
            problem += works_employees[(work_id, emp_id)] == 0, f"Freetime_{emp_id}_{work_id}"
        
        # 4. Pause zwischen den Schichten
        for id1, id2 in rest_pairs:
            problem += (
                works_employees[(id1, emp_id)] + works_employees[(id2, emp_id)]
            ) <= 1, f"Rest_12_Hours_{emp_id}_{id1}_{id2}"
            
    problem.solve()

    allocated_works = []

    # Ergebnisse ausgeben
    for work in works:
        for employee in employees:
            if value(works_employees[(work['_id'], employee['short'])]) == 1:
                print(f"{employee['short']} is assigned to work {work['_id']}")
                allocated_works.append({"workId": work["_id"], "employeeId": employee["_id"]})
                
    return allocated_works

if __name__ == "__main__":
    input_data = sys.stdin.read()
    data = json.loads(input_data)

    works, employees = get_data(data)
    
    allocated_works = allocate(works, employees)

    print("START_JSON_OUTPUT")
    print(json.dumps(allocated_works))