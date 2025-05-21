import {
  faBriefcase,
  faCalendar,
  faCalendarDay,
  faCar,
  faClock,
  faFileLines,
  faHashtag,
  faRepeat,
  faSwimmer,
  faTable,
  faUser,
} from "@fortawesome/free-solid-svg-icons"

export const icons = {
  employee: faUser,
  schedule: faCalendar,
  work: faBriefcase,
  // employment: faClock,
  // shift: faCalendarDay,
  // job: faFileLines,
  // rrule: faRepeat,
  employment: faHashtag,
  shift: faHashtag,
  job: faHashtag,
  rrule: faHashtag,
  freetime: faTable,
  mission: faCar,
  default: faHashtag,
}

export const titles = {
  employee: "Mitarbeiter",
  schedule: "Dienstpläne",
  work: "Dienste",
  employment: "Anstellungsverhältnisse",
  shift: "Schichten",
  job: "Jobs",
  freetime: "Dienstplanwünsche",
  rrule: "Schichten",
  mission: "Einsatzprotokolle",
  default: "Objekte",
}

export const title = {
  employee: "Mitarbeiter",
  schedule: "Dienstplan",
  work: "Dienst",
  employment: "Anstellungsverhältnis",
  shift: "Schicht",
  job: "Job",
  freetime: "Dienstplanwunsch",
  rrule: "Schicht",
  mission: "Einsatzprotokoll",
  default: "Objekt",
}

export const labels = {
  short: "Kürzel",
  title: "Name",
  minHours: "Minimum",
  maxHours: "Maximum",
  date: "Datum",
  type: "Art",
  content: "Inhalt",
  start: "Start",
  end: "Ende",
  deadline: "Deadline",
  time: "Zeitpunkt",
  km: "Kilometer",
  info: "Zusätzliche Information"
}

export const localeString = {
  country: "de-DE",
  default: {},
}

export const selectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "transparent",
    border: state.isFocused ? "1px solid lightgray" : "1px solid lightgray",
    "&:hover": {
      border: state.isFocused ? "1px solid lightgray" : "1px solid lightgray",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: "transparent",
    color: "black",
    "&:hover": {
      backgroundColor: "lightgray",
      color: "black",
    },
    "&:selected": {
      backgroundColor: "lightgray",
      color: "black",
    },
  }),
}
