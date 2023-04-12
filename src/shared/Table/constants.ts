

export interface IColumn {
  label: string;
  layout?: (row: any) => JSX.Element;
  field?: string;
  isSortable?: boolean;
}

