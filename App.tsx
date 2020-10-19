import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Rn from 'react-native';

export default function App() {
	const [values, setValues] = React.useState<number[]>(generateRandomNonSortedIntegers(0, 10, 4));
	const [selectedValue, setSelectedValue] = React.useState<number | null>(null);

	// Get a sorted copy of the values
	const sortedValues = [...values].sort();

	/** Generates a randomly generated array of numbers that are not sorted */
	function generateRandomNonSortedIntegers(min: number, max: number, count: number): number[] {
		// There are only (max - min) integers available, so the count must be fewer than that.
		if (count > max - min) throw new Error('Cannot get more values than there are available integers.')

		// Generate the integers
		const result: number[] = [];
		for (let i = 0; i < count; i++) {
			let randomInteger: number;

			// We generate an integer randomly within the given interval
			do randomInteger = Math.round(Math.random() * (max - min) + min)
			// Make sure our generated integer has not already been generated.
			while (result.includes(randomInteger))

			// Add the integer to our array
			result.push(randomInteger);
		}

		// If the generated array is already sorted, then generate a new one
		const sortedResult = [...result].sort();
		return arraysAreEqual(result, sortedResult) ? generateRandomNonSortedIntegers(min, max, count) : result;
	}

	/** Checks whether the two arrays have the same elements in the same order. */
	function arraysAreEqual<T>(a: T[], b: T[]): boolean {
		// If they reference the same array object, then they are equal.
		if (a === b) return true;

		// If they have different number of elements, then they are not equal.
		if (a.length !== b.length) return false;

		// Check every element to see if they match
		for (let i = 0; i < a.length; i++) {
			if (a[i] !== b[i]) return false;
		}
		return true;
	}

	return (
		<Rn.View style={styles.container}>
			{/* Generate a button for each value */}
			{values.map(value => (
				<Rn.Button
					key={value}
					title={value.toString()}
					onPress={() => {
						if (selectedValue === null) {
							// If we haven't selected a value already, then we select this one
							setSelectedValue(value);
						} else if (selectedValue === value) {
							// If we've selected this value before and we've pressed this again, then we simply unselect the value.
							setSelectedValue(null);
						} else {
							// Here, we want to swap the selected value with this one
							setValues(prevValues => {
								const valuesCopy = [...prevValues];

								// Get the indices of the selected value and this button's value
								const valueIndex = valuesCopy.indexOf(value);
								const selectedValueIndex = valuesCopy.indexOf(selectedValue);
								
								// Swap the two values
								valuesCopy[valueIndex] = selectedValue;
								valuesCopy[selectedValueIndex] = value;

								return valuesCopy;
							})
							// We've done the swap, so lets reset the selection.
							setSelectedValue(null);
						}
					}}
					color={selectedValue === value ? "#009900" : "#990000"}
				/>
			))}
			{/* Show the winning message if the user sorts the values */}
			{arraysAreEqual(values, sortedValues) && <Rn.Text>You win!</Rn.Text>}
			<StatusBar style="dark" />
		</Rn.View>
	);
}

const styles = Rn.StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	winText: {
		color: "#000099",
		fontWeight: "bold",
		fontSize: 20
	}
});
