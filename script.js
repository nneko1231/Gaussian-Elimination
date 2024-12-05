function generateMatrix() {
    const size = parseInt(document.getElementById('matrix-size').value, 10);
    const container = document.getElementById('matrix-container');
    container.innerHTML = ''; // Clear previous matrix

    if (isNaN(size) || size < 2 || size > 10) {
        alert("Please enter a valid matrix size between 2 and 10.");
        return;
    }

    const matrixAContainer = document.createElement('div');
    matrixAContainer.classList.add('matrix');
    matrixAContainer.style.gridTemplateColumns = `repeat(${size}, 60px)`;

    const matrixBContainer = document.createElement('div');
    matrixBContainer.classList.add('matrix');
    matrixBContainer.style.gridTemplateColumns = `repeat(1, 60px)`;

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.id = `cell-${i}-${j}`;
            input.placeholder = "0";
            matrixAContainer.appendChild(input);
        }
        const inputB = document.createElement('input');
        inputB.type = 'number';
        inputB.id = `cell-${i}-${size}`;
        inputB.placeholder = "0";
        matrixBContainer.appendChild(inputB);
    }

    container.appendChild(matrixAContainer);
    container.appendChild(matrixBContainer);
}

function solveMatrix() {
    const size = parseInt(document.getElementById('matrix-size').value, 10);
    const matrix = [];
    const steps = [];

    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j <= size; j++) {
            const inputValue = document.getElementById(`cell-${i}-${j}`).value;
            if (inputValue === "" || isNaN(parseFloat(inputValue))) {
                alert("Please fill all matrix values!");
                return;
            }
            row.push(parseFloat(inputValue));
        }
        matrix.push(row);
    }

    steps.push(`Initial Matrix:<br>${formatMatrix(matrix)}`);

    for (let i = 0; i < size; i++) {
        if (matrix[i][i] === 0) {
            let swapped = false;
            for (let k = i + 1; k < size; k++) {
                if (matrix[k][i] !== 0) {
                    [matrix[i], matrix[k]] = [matrix[k], matrix[i]];
                    swapped = true;
                    steps.push(`Swap Row ${i + 1} with Row ${k + 1}:<br>${formatMatrix(matrix)}`);
                    break;
                }
            }
            if (!swapped) {
                alert("No unique solution exists (diagonal element is zero).");
                return;
            }
        }

        const diag = matrix[i][i];
        for (let j = 0; j <= size; j++) {
            matrix[i][j] /= diag;
        }
        steps.push(`R${i + 1} -> R${i + 1} / ${diag}:<br>${formatMatrix(matrix)}`);

        for (let k = 0; k < size; k++) {
            if (k !== i) {
                const factor = matrix[k][i];
                for (let j = 0; j <= size; j++) {
                    matrix[k][j] -= factor * matrix[i][j];
                }
                steps.push(`R${k + 1} -> R${k + 1} - (${factor}) * R${i + 1}:<br>${formatMatrix(matrix)}`);
            }
        }
    }

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<h3>Solution Steps:</h3>';
    steps.forEach(step => {
        resultDiv.innerHTML += `<div>${step}</div>`;
    });

    const solution = [];
    for (let i = 0; i < size; i++) {
        solution.push(`x${i + 1} = ${matrix[i][size].toFixed(2)}`);
    }

    resultDiv.innerHTML += `<h4>Answer:</h4>${solution.join('<br>')}`;
}

function formatMatrix(matrix) {
    return matrix.map(row => `[ ${row.map(num => num.toFixed(2)).join(' ')} ]`).join('<br>');
}
