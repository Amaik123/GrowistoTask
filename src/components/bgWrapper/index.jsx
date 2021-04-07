import React from "react";
import styled from "styled-components";

const BgWrapper = Main => ({ children, ...props }) => (
  <ColoredWrapper>
    <WidthWrapper>
      <Main {...props} />
    </WidthWrapper>
  </ColoredWrapper>
);

export default BgWrapper;

const ColoredWrapper = styled.div`
  display: flex;
  &:after {
    content: "";
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
  }
`;

const WidthWrapper = styled.div`
  width: 100%;
  margin: 106px auto 0;
`;
