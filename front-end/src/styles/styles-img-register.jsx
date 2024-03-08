import styled from 'styled-components';

export const Container = styled.div`
  position: relative; /* Importante para posicionar os elementos filhos de forma absoluta */
  height: 65px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ededed;
  margin-bottom: 20px;
  border-radius: 5px 5px 0px 0px;
  color: black;
  padding-left: 20px; /* Adiciona algum espaço à esquerda para evitar que o Label fique colado à borda */
`;

export const Label = styled.p`
  position: absolute; /* Torna o Label posicionado absolutamente dentro do Container */
  left: 0; /* Alinha o Label à esquerda do Container */
  top: 0; /* Alinha o Label ao topo do Container */
  color: black;
  font-weight: bolder;
  font-family: arial
  margin-top: 5px;
  margin-left: 10px;
`;

export const Content = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 25px;
  background: #fff;
  border-radius: 4px;
  color: black;
  padding: 5px
`;
