export default <T extends Record<string, any>>(
	obj: T,
	...keys: string[]
): Pick<T, keyof T> =>
	Object.entries(obj).reduce(
		(acc, [key, value]) =>
			keys.includes(key) ? { ...acc, [key]: value } : acc,

		{} as Pick<T, keyof T>
	);
