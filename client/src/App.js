import React from "react"
import Alert from "react-bootstrap/Alert"
import Container from "react-bootstrap/Container"

function App() {
  return (
    <div>
      <Container>
        <Alert key="1" variant="primary">
          This is alert with <Alert.Link href="#">an example link</Alert.Link>.
          Give it a click if you like.
        </Alert>
      </Container>
    </div>
  )
}

export default App
