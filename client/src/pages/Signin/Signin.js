import React, { useState, useEffect } from "react";
import {gql, useMutation} from "@apollo/client";
import { Form } from "react-bootstrap";
import Button from "@restart/ui/esm/Button";

const SIGN_IN = gql`
  mutation($email: String!, $password: String!) {
    signIn(credentials: {email: $email, password: $password}) {
      userErrors {
        message
      }
      token
    }
  }
`;

export default function Signin() {

  const [signIn, {data, loading}] = useMutation(SIGN_IN);

  console.log(data);


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleClick = () => {
    signIn({
      variables: {
        email,
        password
      }
    })
  };

  const [error, setError] = useState(null);

  useEffect(() => {
    if (data) {
      if (data.signIn.userErrors.length) {
        setError(data.signIn.userErrors[0].message)
      }
      if (data.signIn.token) {
        localStorage.setItem('token', data.signIn.token)
      }
    }
  }, [data]);

  return (
    <div>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            placeholder=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        {error && <p>{error}</p>}
        <Button onClick={handleClick}>Signin</Button>
      </Form>
    </div>
  );
}
