export default (subset, superset) => [...subset].every((el) => superset.has(el));
