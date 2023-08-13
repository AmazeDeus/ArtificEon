import { createContext, useState } from 'react';

export const ContainerWidthContext = createContext();

export function ContainerWidthProvider({ children }) {
  const [containerWidth, setContainerWidth] = useState(0);

  return (
    <ContainerWidthContext.Provider value={{ containerWidth, setContainerWidth }}>
      {children}
    </ContainerWidthContext.Provider>
  );
}