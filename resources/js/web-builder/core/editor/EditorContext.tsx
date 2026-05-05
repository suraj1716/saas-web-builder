// web-builder/core/editor/EditorContext.tsx

import React, { createContext, useContext } from "react";

type EditorContextType = {
  editing: boolean;
  updateSection: (
    id: string | number,
    updater: any
  ) => void;

  
  site: any;
  setSite: (site: any) => void;
};

const EditorContext = createContext<EditorContextType>({
  editing: false,

  updateSection: () => {},

  // MUST be default values
  // cannot use site / setSite directly here
  site: null,

  setSite: () => {},
});

export const useEditor = () => useContext(EditorContext);

export default EditorContext;