import React from "react"
import Modal from "react-bootstrap/Modal"
import Table from "react-bootstrap/Table"
import Button from "react-bootstrap/Button"
import Badge from "./Badge"

const ReportPopup = ({ show, close, report }) => {
  const generateLatexTable = (report) => {
    if (
      !report ||
      !report["employeesReport"] ||
      report["employeesReport"].length === 0
    ) {
      return "Kein Bericht verfügbar."
    }

    let latex = `
  \\begin{table}[ht]
  \\centering
  \\begin{tabular}{|l|l|l|l|l|l|l|}
  \\hline
  Mitarbeiter & Min Std. & Stunden & Max Std. & Min Pause & Frei erfüllt & Keine Überlappungen \\\\ \\hline
  `

    report.employeesReport.forEach((entry) => {
      const totalWork = entry.totalWorkHours.toFixed(2)
      const minHours = entry.employee?.minHours
      const maxHours = entry.employee?.maxHours

      const minHourColor =
        totalWork >= minHours ? "\\cellcolor{dkgreen}" : "\\cellcolor{orange}"

      const maxHourColor =
        totalWork <= maxHours ? "\\cellcolor{dkgreen}" : "\\cellcolor{orange}"

      const hourColor =
        totalWork <= maxHours && totalWork >= minHours
          ? "\\cellcolor{dkgreen}"
          : "\\cellcolor{orange}"

      const breakColor =
        entry.smallestBreak !== null && entry.smallestBreak >= 12
          ? "\\cellcolor{dkgreen}"
          : "\\cellcolor{orange}"

      const freetimeColor = !entry.freetimeOverlaps
        ? "\\cellcolor{dkgreen}"
        : "\\cellcolor{orange}"

      const overlapColor = !entry.hasOverlappingShifts
        ? "\\cellcolor{dkgreen}"
        : "\\cellcolor{orange}"

      latex += `
  ${entry.employee?.short || "N/A"} & 
  ${minHourColor + (entry.employee?.minHours || "N/A")} & 
  ${hourColor + entry.totalWorkHours.toFixed(2)} & 
  ${maxHourColor + (entry.employee?.maxHours || "N/A")} & 
  ${
    breakColor +
    (entry.smallestBreak !== null ? entry.smallestBreak.toFixed(2) : "N/A")
  } & 
  ${freetimeColor + (!entry.freetimeOverlaps ? "Ja" : "Nein")} & 
  ${overlapColor + (!entry.hasOverlappingShifts ? "Ja" : "Nein")} \\\\ \\hline
  `
    })

    // Add the sum row
    const totalMinHoursColor =
      report.totalMinHours <= report.totalMaxHours
        ? "\\cellcolor{dkgreen}"
        : "\\cellcolor{orange}"

    const totalWorkHoursColor =
      report.totalMaxHours >= report.totalWorkHoursForMonth &&
      report.totalMinHours <= report.totalMaxHours
        ? "\\cellcolor{dkgreen}"
        : "\\cellcolor{orange}"

    const totalMaxHoursColor =
      report.totalMaxHours >= report.totalWorkHoursForMonth
        ? "\\cellcolor{dkgreen}"
        : "\\cellcolor{orange}"

    latex += `
  \\textbf{Summe:} & 
  ${totalMinHoursColor + report.totalMinHours} & 
  ${totalWorkHoursColor + report.totalWorkHoursForMonth} & 
  ${totalMaxHoursColor + report.totalMaxHours} \\\\ \\hline
  `

    latex += `
  \\end{tabular}
  \\caption{Generierungsergebnis für ${report.totalWorkHoursForMonth} Dienststunden bei ${report.totalMinHours} bis ${report.totalMaxHours} verfügbaren Mitarbeiterstunden}
  \\end{table}
  `

    return latex
  }
  return (
    <Modal show={show} onHide={close} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Bericht</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {report &&
        report["employeesReport"] &&
        report["employeesReport"].length > 0 ? (
          <>
            <textarea value={generateLatexTable(report)}></textarea>

            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Mitarbeiter</th>
                  <th>Stunden Min</th>
                  <th>Stunden</th>
                  <th>Stunden Max</th>
                  <th>Kürzeste Pause</th>
                  <th>Überlappungen mit Wunschfrei</th>
                  <th>Überlappende Schichten</th>
                </tr>
              </thead>
              <tbody>
                {report["employeesReport"].map((entry, index) => (
                  <tr key={index}>
                    <td>
                      <Badge
                        resource={entry.employee}
                        resourceName="employee"
                      />
                    </td>
                    <td
                      className={
                        entry.employee?.minHours <= entry.totalWorkHours
                          ? "table-success"
                          : "table-danger"
                      }
                    >
                      {entry.employee?.minHours}
                    </td>
                    <td
                      className={
                        entry.withinHours ? "table-success" : "table-danger"
                      }
                    >
                      {entry.totalWorkHours.toFixed(2)}
                    </td>
                    <td
                      className={
                        entry.employee?.maxHours >= entry.totalWorkHours
                          ? "table-success"
                          : "table-danger"
                      }
                    >
                      {entry.employee?.maxHours}
                    </td>
                    <td
                      className={
                        entry.has12HourBreaks ? "table-success" : "table-danger"
                      }
                    >
                      {entry.smallestBreak !== null
                        ? entry.smallestBreak.toFixed(2)
                        : "N/A"}
                    </td>
                    <td
                      className={
                        entry.freetimeOverlaps
                          ? "table-danger"
                          : "table-success"
                      }
                    >
                      {entry.freetimeOverlaps ? "Ja" : "Nein"}
                    </td>
                    <td
                      className={
                        entry.hasOverlappingShifts
                          ? "table-danger"
                          : "table-success"
                      }
                    >
                      {entry.hasOverlappingShifts ? "Ja" : "Nein"}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="1" className="text-end">
                    <strong>Summe:</strong>
                  </td>
                  <td
                    className={
                      report.totalMinHours <= report.totalMaxHours
                        ? "table-success"
                        : "table-danger"
                    }
                  >
                    <strong>{report.totalMinHours}</strong>
                  </td>
                  <td
                    className={
                      report.totalMaxHours >= report.totalWorkHoursForMonth &&
                      report.totalMinHours <= report.totalMaxHours
                        ? "table-success"
                        : "table-danger"
                    }
                  >
                    <strong>{report.totalWorkHoursForMonth}</strong>
                  </td>
                  <td
                    className={
                      report.totalMaxHours >= report.totalWorkHoursForMonth
                        ? "table-success"
                        : "table-danger"
                    }
                  >
                    <strong>{report.totalMaxHours}</strong>
                  </td>
                  <td colSpan="4"></td>
                </tr>
              </tbody>
            </Table>
            <p>
              Generierungsergebnis für{" "}
              <strong>{report.totalWorkHoursForMonth} / </strong>
              <strong>{report.totalWorkHoursAllWorks}</strong>
            </p>
          </>
        ) : (
          <p>Kein Bericht verfügbar.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Schließen
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ReportPopup
