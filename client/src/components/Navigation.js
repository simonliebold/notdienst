import React from "react"
import { useAuth } from "../contexts/AuthContext"

import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import NavDropdown from "react-bootstrap/NavDropdown"
import Container from "react-bootstrap/Container"
import { Link, useLocation } from "react-router-dom"

function Navigation({ routes }) {
  const token = useAuth()
  const location = useLocation()

  if (token)
    return (
      <Navbar className=" border start-0 end-0">
        <Container>
          <Nav className="z-1">
            {routes.map((route) => {
                if(!route.protected) return null
                return (
                <Nav.Link
                  as={Link}
                  href="#"
                  to={route.path}
                  key={"navlink-" + route.name}
                >
                  {location.pathname === route.path && (
                    <strong>{route.name}</strong>
                  )}
                  {location.pathname !== route.path && route.name}
                </Nav.Link>
              )
            })}
          </Nav>
        </Container>
      </Navbar>
    )
}

export default Navigation
