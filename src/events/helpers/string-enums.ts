export enum EventErrors {
  filterOutOfBounds = 'the when property of the filter argument is incorrect. options are {no-filer=all, today=2, tomorrow=3, thisWeek=4, nextWeek=5}',

  filterUndefined = 'filer.when is undefined',
}

export enum EventDebugs {
  hitFindAll = 'hit the find all end-point without any filters',
}
