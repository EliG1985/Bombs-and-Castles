// Error handling and basic testing
export function handleError(error) {
    // Display error message to user
    alert('Error: ' + error.message);
}

// Example unit test
export function testBombsLeft(scene) {
    if (scene.bombsLeft < 0) {
        throw new Error('Bombs left cannot be negative');
    }
}
