import {
  faBriefcase,
  faCalendar,
  faCalendarDay,
  faCar,
  faClock,
  faCode,
  faHashtag,
  faRepeat,
  faTable,
  faUser,
} from "@fortawesome/free-solid-svg-icons"

export const icons = {
  employee: faUser,
  schedule: faCalendar,
  work: faBriefcase,
  employment: faClock,
  shift: faCalendarDay,
  job: faCar,
  freetime: faTable,
  rrule: faRepeat,
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
  rrule: "Wiederholungsmuster",
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
  rrule: "Wiederholungsmuster",
  default: "Objekt",
}

export const labels = {
  short: "Kürzel",
  title: "Name",
  minHours: "Minimum",
  maxHours: "Maximum"
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
