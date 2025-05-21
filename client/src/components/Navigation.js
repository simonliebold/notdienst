import React, { useEffect, useState } from "react"
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

const NavItem = ({ route, className }) => {
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

  const routes = [
    {
      name: "Startseite",
      icon: faHome,
      path: "/",
    },
    {
      name: "Elements",
      icon: faCube,
      path: "/elements",
    },
  ]

  const logout = { name: "Logout", path: "/logout", icon: faRightFromBracket }

  if (token)
    return (
      <Navbar className="border-bottom start-0 end-0">
        <Container>
          <Nav className="z-1 w-100">
            {routes.map((route) => {
              return <NavItem key={"route-" + route.path} route={route} />
            })}
            <NavItem
              className="ms-auto text-secondary"
              route={logout}
            ></NavItem>
          </Nav>
        </Container>
      </Navbar>
    )
}

export default Navigation
