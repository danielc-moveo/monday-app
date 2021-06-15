import styled from "styled-components";
export const Header1 = styled.p`
  font-size: 22px;
  color: ${({ theme }) => theme.color};
`;
export const Header2 = styled.p`
  font-size: 18px;
  color: ${({ theme }) => theme.color};
`;
export const Header3 = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.color};
`;
export const FlexedColCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const IconBtn = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none;
`;
