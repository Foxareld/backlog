import { useState, useEffect } from 'react';

export default function useDebounce<T>(value: T, delay = 500) {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		// Set a timeout to update the debounced value after the delay
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// Clean up the timeout if value or delay changes (user is still typing)
		return () => {
			clearTimeout(timer);
		};
	}, [value, delay]);

	return debouncedValue;
}
