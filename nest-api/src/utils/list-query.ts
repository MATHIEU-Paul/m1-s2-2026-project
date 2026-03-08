export type SortDirection = 'ASC' | 'DESC';

export type ListSortModel<TField extends string = string> = {
  field: TField;
  direction: SortDirection;
};

export type ListQueryModel<TField extends string = string> = {
  limit?: number;
  offset: number;
  sort: ListSortModel<TField>;
};

type RawListQueryInput = {
  limit?: number | string;
  offset?: number | string;
  sort?: string;
};

type ParseListQueryOptions<TField extends string> = {
  defaultSortField: TField;
  defaultSortDirection?: SortDirection;
  defaultOffset?: number;
  minLimit?: number;
  maxLimit?: number;
};

export const parseListQueryParams = <TField extends string>(
  input: RawListQueryInput,
  options: ParseListQueryOptions<TField>,
): ListQueryModel<TField> => {
  const {
    defaultSortField,
    defaultSortDirection = 'ASC',
    defaultOffset = 0,
    minLimit = 1,
    maxLimit = 100,
  } = options;

  const sortParts = input.sort?.split(/[,:]/) ?? [];
  const rawSortField = sortParts[0]?.trim();
  const rawSortDirection = sortParts[1]?.trim().toUpperCase();

  const sortField = (rawSortField || defaultSortField) as TField;
  const sortDirection: SortDirection =
    rawSortDirection === 'DESC' ? 'DESC' : defaultSortDirection;

  const parsedLimit = Number(input.limit);
  const parsedOffset = Number(input.offset);

  const isLimitValid =
    Number.isFinite(parsedLimit) &&
    parsedLimit >= minLimit &&
    parsedLimit <= maxLimit;

  const limit = isLimitValid ? parsedLimit : undefined;

  const offset =
    Number.isFinite(parsedOffset) && parsedOffset >= 0
      ? parsedOffset
      : defaultOffset;

  return {
    limit,
    offset,
    sort: {
      field: sortField,
      direction: sortDirection,
    },
  };
};
