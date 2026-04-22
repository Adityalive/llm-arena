console.log('Hello from TypeScript! LLM Arena project with TS setup complete.');

// Sample typed function
function greet(name: string): string {
  return `Welcome to LLM Arena, ${name}!`;
}

console.log(greet('Developer'));

// Simple async example
async function fetchData(): Promise<void> {
  // Simulate API call
  const data = await new Promise<string>((resolve) => 
    setTimeout(() => resolve('Sample data loaded'), 100)
  );
  console.log(data);
}

fetchData();
