import styled from "styled-components";

export const Button = styled.div`
  position: fixed;
  width: 1em;
  left: 50%;
  bottom: 40px;
  height: 20px;
  font-size: 3rem;
  z-index: 1;
  cursor: pointer;
  color: green;
  animation: scanner-loop 3s ease-in-out infinite;
  transition: color 450ms;
  &:hover {
    color: rgb(100, 250, 150);
  }
`;

export const ShowButton = styled.h1`
  text-align: center;
  color: green;
`;
