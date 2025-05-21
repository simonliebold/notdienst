import {
  faBriefcase,
  faCalendar,
  faCalendarDay,
  faCalendarXmark,
  faCar,
  faClock,
  faCode,
  faHashtag,
  faUser,
} from "@fortawesome/free-solid-svg-icons"

export const icons = {
  employee: faUser,
  schedule: faCalendar,
  work: faBriefcase,
  employment: faClock,
  shift: faCalendarDay,
  job: faCar,
  freetime: faCalendarXmark,
  rrule: faCode,
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
  rrule: "Rrules",
  default: "Objekte",
}

export const localeString = {
  country: "de-DE",
  default: {},
}

export const selectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "transparent",
    // className: "primary text-primary",
    border: state.isFocused ? "1px solid #11306F" : "1px solid #6C757D",
    "&:hover": {
      border: state.isFocused ? "1px solid #11306F" : "1px solid #6C757D",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: "transparent",
    color: "black",
    // color: state.isSelected ? "white" : "black",
    "&:hover": {
      backgroundColor: "lightgray", // Hintergrundfarbe im Hover-Zustand ändern
      color: "black", // Textfarbe im Hover-Zustand ändern
    },
    "&:selected": {
      backgroundColor: "lightgray", // Hintergrundfarbe im Hover-Zustand ändern
      color: "black", // Textfarbe im Hover-Zustand ändern
    },
  }),
}
