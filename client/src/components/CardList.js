import React from "react"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/esm/Col"

function CardList({ children }) {
  return (
    <Row xs={1} lg={2} xl={3} xxl={4} className="g-3">
      {children.map((child) => (
        <Col>{child}</Col>
      ))}
    </Row>
  )
}

export default CardList
