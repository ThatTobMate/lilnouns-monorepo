/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum FilterType {
  MULTI_SELECT = "MULTI_SELECT",
  SINGLE_SELECT = "SINGLE_SELECT",
}

export interface FilterInput {
  id: string;
  value: string;
}

export interface PropLotInputOptions {
  filters?: FilterInput[] | null;
  requestUUID: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
