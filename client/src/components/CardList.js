import React from "react"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/esm/Col"
import TitleCard from "./TitleCard"

function CardList({ children, className }) {
  return (
    <Row xs={1} lg={2} xl={3} xxl={4} className={"g-3 " + className}>
      {children?.map((child, i) => (
        <Col key={"cardlist-col-" + i}>{child}</Col>
      ))}
      {!children && <TitleCard />}
    </Row>
  )
}

export default CardList
