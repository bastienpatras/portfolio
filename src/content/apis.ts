import type { APIDemo } from '@/types';

export const apis: APIDemo[] = [
  {
    id: 'dpe-matcher',
    title: "Sherlock'Homes \ud83c\udfe0 API",
    description:
      'Matches a French property to its official energy performance certificate (DPE) from the ADEME database. Geocodes the address via the BAN API, fetches DPE candidates from the ADEME open data, and applies a weighted scoring algorithm (area, floor, date recency, label dispersion) to identify the best match.',
    tags: ['energy-efficiency', 'real-estate', 'geocoding', 'france'],
    limitations: [
      'Coverage limited to mainland France and overseas departments',
      'Depends on ADEME open data availability (15M+ records)',
      'Address must be precise enough for BAN geocoding',
      'Area matching tolerance: ±3 m²',
    ],
    endpoints: [
      {
        method: 'POST',
        path: '/api/dpe-matcher',
        description: 'Find the best DPE match for a property',
        parameters: [
          {
            name: 'address',
            type: 'string',
            required: true,
            description: 'Full French address (e.g. "25 Rue de Belfort, 11000 Carcassonne")',
          },
          {
            name: 'area',
            type: 'number',
            required: true,
            description: 'Living area in m²',
          },
          {
            name: 'floor',
            type: 'number',
            required: false,
            description: 'Floor number (apartments only)',
          },
          {
            name: 'propertyType',
            type: 'string',
            required: false,
            description: 'APARTMENT or HOUSE',
            default: 'APARTMENT',
          },
          {
            name: 'publicationDate',
            type: 'string',
            required: false,
            description: 'Reference date (YYYY-MM-DD) — DPEs issued after this date are excluded',
          },
          {
            name: 'fields',
            type: 'string[]',
            required: false,
            description: 'Additional ADEME fields to include in the response (see Available Fields below)',
          },
        ],
        response:
          '{"geocoding": {"label": "...", "lat": 43.21, ...}, "match": {"found": true, "best": {"dpeLabel": "C", ...}, "candidates": [...], "stats": {...}}}',
      },
    ],
    examples: [
      {
        language: 'curl',
        description: 'Match a Carcassonne apartment',
        code: `curl -X POST http://localhost:5173/api/dpe-matcher \\
  -H "Content-Type: application/json" \\
  -d '{
    "address": "25 Rue de Belfort, 11000 Carcassonne",
    "area": 46,
    "floor": 2,
    "propertyType": "APARTMENT"
  }'`,
      },
      {
        language: 'python',
        description: 'Using requests library',
        code: `import requests

response = requests.post(
    "http://localhost:5173/api/dpe-matcher",
    json={
        "address": "178 Rue de Rivoli, 75001 Paris",
        "area": 65,
        "propertyType": "APARTMENT",
        "publicationDate": "2025-01-01"
    }
)
result = response.json()
if result["match"]["found"]:
    best = result["match"]["best"]
    print(f"DPE: {best['dpeLabel']} (score: {best['matchScore']})")
    print(f"Certificate: {best['numero_dpe']}")`,
      },
    ],
    securityNotes: [
      'No authentication required — demo endpoint',
      'Queries are proxied to public APIs (BAN + ADEME) and not logged',
      'No personal data is stored',
    ],
    rateLimit: 'Subject to BAN and ADEME API rate limits',
    lastUpdated: '2025-06-01',
  },
  {
    id: 'text-classification',
    title: 'Text Classification API',
    description:
      'A RESTful API for multi-class text classification using state-of-the-art transformer models. Supports custom fine-tuning and batch processing.',
    tags: ['nlp', 'classification', 'transformers', 'api'],
    limitations: [
      'Maximum input length: 512 tokens',
      'Rate limit: 100 requests per minute',
      'English text only in current version',
      'Not suitable for real-time applications (avg latency: 200ms)',
    ],
    endpoints: [
      {
        method: 'POST',
        path: '/api/v1/classify',
        description: 'Classify a single text input',
        parameters: [
          {
            name: 'text',
            type: 'string',
            required: true,
            description: 'The text to classify (max 512 tokens)',
          },
          {
            name: 'model',
            type: 'string',
            required: false,
            description: 'Model variant to use',
            default: 'base',
          },
          {
            name: 'return_probabilities',
            type: 'boolean',
            required: false,
            description: 'Whether to return class probabilities',
            default: 'false',
          },
        ],
        response: '{"label": "positive", "confidence": 0.95, "probabilities": {...}}',
      },
      {
        method: 'POST',
        path: '/api/v1/classify/batch',
        description: 'Classify multiple texts in a single request',
        parameters: [
          {
            name: 'texts',
            type: 'array[string]',
            required: true,
            description: 'Array of texts to classify (max 100 items)',
          },
        ],
        response: '[{"label": "positive", "confidence": 0.95}, ...]',
      },
    ],
    examples: [
      {
        language: 'curl',
        description: 'Simple classification request',
        code: `curl -X POST https://api.example.com/v1/classify \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "text": "This product is amazing!",
    "return_probabilities": true
  }'`,
      },
      {
        language: 'javascript',
        description: 'Using fetch API',
        code: `const response = await fetch('https://api.example.com/v1/classify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    text: 'This product is amazing!',
    return_probabilities: true
  })
});

const result = await response.json();
console.log(result);`,
      },
      {
        language: 'python',
        description: 'Using requests library',
        code: `import requests

url = "https://api.example.com/v1/classify"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
}
data = {
    "text": "This product is amazing!",
    "return_probabilities": True
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result)`,
      },
    ],
    securityNotes: [
      'All requests must include a valid API key in the Authorization header',
      'API keys should be kept secret and never committed to version control',
      'Use HTTPS for all requests',
      'Input text is not stored or logged',
    ],
    rateLimit: '100 requests per minute per API key',
    lastUpdated: '2024-11-15',
  },
  {
    id: 'attention-visualization',
    title: 'Attention Visualization API',
    description:
      'Interactive API for visualizing attention patterns in transformer models. Useful for model interpretability and debugging.',
    tags: ['visualization', 'transformers', 'interpretability', 'attention'],
    limitations: [
      'Maximum sequence length: 256 tokens',
      'Only supports BERT-style models currently',
      'Visualization generation can take up to 5 seconds',
    ],
    endpoints: [
      {
        method: 'POST',
        path: '/api/v1/visualize',
        description: 'Generate attention visualization',
        parameters: [
          {
            name: 'text',
            type: 'string',
            required: true,
            description: 'Input text to analyze',
          },
          {
            name: 'layer',
            type: 'integer',
            required: false,
            description: 'Transformer layer to visualize (0-11)',
            default: '6',
          },
          {
            name: 'head',
            type: 'integer',
            required: false,
            description: 'Attention head to visualize (0-11)',
            default: '0',
          },
        ],
        response: '{"attention_matrix": [[...]], "tokens": [...], "svg": "..."}',
      },
    ],
    examples: [
      {
        language: 'curl',
        code: `curl -X POST https://api.example.com/v1/visualize \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "The cat sat on the mat",
    "layer": 6,
    "head": 0
  }'`,
      },
    ],
    securityNotes: [
      'No authentication required for demo purposes',
      'Please do not send sensitive or private data',
    ],
    rateLimit: '20 requests per minute per IP address',
    lastUpdated: '2024-10-01',
  },
  {
    id: 'efficiency-benchmark',
    title: 'Model Efficiency Benchmark API',
    description:
      'Benchmark the computational efficiency of ML models by measuring FLOPs, memory usage, and inference latency across different hardware configurations.',
    tags: ['benchmarking', 'efficiency', 'performance', 'profiling'],
    limitations: [
      'Supports PyTorch and ONNX models only',
      'Maximum model size: 1GB',
      'Benchmark execution time: 2-10 minutes',
    ],
    endpoints: [
      {
        method: 'POST',
        path: '/api/v1/benchmark',
        description: 'Submit a model for benchmarking',
        parameters: [
          {
            name: 'model_url',
            type: 'string',
            required: true,
            description: 'URL to the model file (.pt or .onnx)',
          },
          {
            name: 'input_shape',
            type: 'array[integer]',
            required: true,
            description: 'Input tensor shape, e.g., [1, 3, 224, 224]',
          },
          {
            name: 'device',
            type: 'string',
            required: false,
            description: 'Device to benchmark on: cpu, cuda, or tpu',
            default: 'cpu',
          },
        ],
        response: '{"flops": 1234567890, "memory_mb": 512, "latency_ms": 45.2, "throughput": 22.3}',
      },
    ],
    examples: [
      {
        language: 'python',
        code: `import requests

url = "https://api.example.com/v1/benchmark"
data = {
    "model_url": "https://example.com/models/resnet50.pt",
    "input_shape": [1, 3, 224, 224],
    "device": "cpu"
}

response = requests.post(url, json=data)
metrics = response.json()
print(f"FLOPs: {metrics['flops']}")
print(f"Memory: {metrics['memory_mb']} MB")
print(f"Latency: {metrics['latency_ms']} ms")`,
      },
    ],
    securityNotes: [
      'Models are downloaded in isolated containers',
      'Models are automatically deleted after benchmarking',
      'Only publicly accessible URLs are supported',
    ],
    rateLimit: '10 benchmarks per hour per user',
    lastUpdated: '2024-09-12',
  },
];
