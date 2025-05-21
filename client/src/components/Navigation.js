import React, { useEffect, useRef, useState } from "react"
import { useAuth } from "../contexts/AuthContext"

import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import Container from "react-bootstrap/Container"
import { Link, useLocation } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCalendar,
  faCube,
  faHome,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons"
import { icons } from "../variables"

import Offcanvas from "react-bootstrap/Offcanvas"

const NavItem = ({ route, className, onClick }) => {
  const location = useLocation()
  const [link, setLink] = useState(false)

  useEffect(() => {
    if (location.pathname === route.path) setLink(location.pathname)
    else setLink(route.path)
  }, [])

  return (
    <Nav.Link
      as={Link}
      href={link}
      to={link}
      key={"navlink-" + route.name}
      className={" text-primary " + className}
      onClick={onClick}
    >
      <>
        {route.icon && <FontAwesomeIcon icon={route.icon} className="me-2" />}
        {location.pathname === route.path && <strong>{route.name}</strong>}
        {location.pathname !== route.path && route.name}
      </>
    </Nav.Link>
  )
}

function Navigation() {
  const token = useAuth()

  const offCanvasRef = useRef()

  const closeOffCanvas = () => offCanvasRef.current.backdrop.click()

  const routes = [
    {
      name: "Startseite",
      icon: faHome,
      path: "/",
    },
    {
      name: "Dienste",
      icon: icons.work,
      path: "/works",
    },
    {
      name: "Mitarbeiter",
      icon: icons.employee,
      path: "/employees",
    },
    {
      name: "Anstellungsverhältnis",
      icon: icons.employment,
      path: "/employments",
    },
    {
      name: "Dienstplanwünsche",
      icon: icons.freetime,
      path: "/freetimes",
    },
    {
      name: "Elemente",
      icon: faCube,
      path: "/elements",
    },
  ]

  const logout = { name: "Logout", path: "/logout", icon: faRightFromBracket }

  if (token)
    return (
      <Navbar className="border-bottom start-0 end-0" expand="lg">
        <Container>
          <Navbar.Toggle />
          <Navbar.Offcanvas ref={offCanvasRef}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Navigation</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="z-1 w-100">
                {routes.map((route) => {
                  return (
                    <NavItem
                      key={"route-" + route.path}
                      route={route}
                      onClick={closeOffCanvas}
                    />
                  )
                })}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
          <NavItem className="ms-auto text-secondary" route={logout} />
        </Container>
      </Navbar>
    )
}

export default Navigation
