import { StyleSheet } from 'react-native';

// These styles are based on the Tailwind classes from our web app.
export const styles = StyleSheet.create({
    // --- Layout ---
    screen: {
        flex: 1,
        padding: 8,
        backgroundColor: '#f4f4f4', // Equivalent to bg-gray-50
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333', // Equivalent to text-gray-800
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },

    // --- Form Elements ---
    input: {
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        padding: 12,
        fontSize: 16,
        marginBottom: 12,
    },
    pickerContainer: {
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        justifyContent: 'center',
        flex: 1,
    },
    picker: {
        height: 50, // Required for Android
        width: '100%',
    },

    // --- Buttons ---
    button: {
        borderRadius: 6,
        padding: 14,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    refreshButton: {
        backgroundColor: '#757575', // Gray
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 4,
    },
    removeButton: {
        backgroundColor: '#E53935', // Red
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    buttonTextSmall: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },

    // --- Bus List ---
    busItem: {
        backgroundColor: '#fcfcfc',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    busRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    busName: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1, // Allow text wrapping
        flexWrap: 'wrap',
    },
    busFare: {
        fontSize: 16,
        color: '#4CAF50', // Green
        fontWeight: 'bold',
    },
    busRoute: {
        fontSize: 14,
        color: '#555',
    },
    busSeats: {
        fontSize: 14,
        color: '#1E88E5', // Blue
    },

    // --- Misc ---
    errorText: {
        color: 'red',
        textAlign: 'center',
        margin: 10,
    },
    emptyText: {
        textAlign: 'center',
        color: '#777',
        marginTop: 20,
    },
});