const express = require('express');
const { body, validationResult } = require('express-validator');
const app = express();
app.use(express.json());

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {

    console.log(`Server is running on http://localhost:${PORT}`);
  });

let products = [
  { id: 1, name: 'Product 1', price: 100 },
  { id: 2, name: 'Product 2', price: 200 },
  { id: 3, name: 'Product 3', price: 300 },
];

// GET all products
app.get('/products', (req, res) => {
  res.json(products);
});

// GET a single product by ID
app.get('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

// POST a new product with empty field validation
app.post( '/products',[body('name').notEmpty().withMessage('Name is required'),body('price').notEmpty().withMessage('Price is required'),],(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newProduct = {
      id: products.length + 1,
      name: req.body.name,
      price: req.body.price,
    };
    products.push(newProduct);
    res.json(newProduct);
  }
);

// PUT (update) a product with empty field validation
app.put('/products/:id',[body('name').optional().notEmpty().withMessage('Name cannot be empty'),body('price').optional().notEmpty().withMessage('Price cannot be empty'),],(req, res) => 
  {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    products[productIndex] = { ...products[productIndex], ...req.body };
    res.json(products[productIndex]);
  }
);

// PATCH (partially update) 
app.patch('/products/:id',[body('name').optional().notEmpty().withMessage('Name cannot be empty'),body('price').optional().notEmpty().withMessage('Price cannot be empty'),],(req, res) => 
  {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    products[productIndex] = { ...products[productIndex], ...req.body };
    res.json(products[productIndex]);
  }
);

// DELETE a product
app.delete('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  products = products.filter(p => p.id !== productId);
  res.json({ message: 'Product deleted' });
});
