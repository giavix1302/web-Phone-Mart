# API Documentation - Product CRUD

## Base URL
```
/api/products
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Thông báo thành công",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Thông báo lỗi",
  "statusCode": 400
}
```

---

## 1. Get All Products (Lấy danh sách tất cả products)

**Endpoint:** `GET /api/products`

**Authentication:** Không cần

**Query Parameters:**
- `brandId` (long, optional): Lọc theo Brand ID
- `categoryId` (long, optional): Lọc theo Category ID
- `minPrice` (decimal, optional): Giá tối thiểu (>= 0)
- `maxPrice` (decimal, optional): Giá tối đa (>= 0)
- `sortBy` (string, optional): Sắp xếp theo field. Mặc định: `"createdAt"`
  - Các giá trị hợp lệ: `"createdAt"`, `"price"`, `"name"`
- `sortDir` (string, optional): Hướng sắp xếp. Mặc định: `"desc"`
  - Các giá trị hợp lệ: `"asc"`, `"desc"`

**Ví dụ Request:**
```
GET /api/products?brandId=4&categoryId=1&minPrice=15044245&maxPrice=31821531
GET /api/products?brandId=1&sortBy=price&sortDir=asc
GET /api/products?categoryId=2&minPrice=100000&maxPrice=500000
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Get products successfully",
  "data": [
    {
      "id": 1,
      "name": "Nike Air Max 90",
      "slug": "nike-air-max-90",
      "description": "Classic running shoes",
      "price": 120.00,
      "discountPrice": 99.99,
      "stockQuantity": 50,
      "isActive": true,
      "categoryId": 1,
      "categoryName": "Shoes",
      "brandId": 1,
      "brandName": "Nike",
      "colors": [
        {
          "id": 1,
          "colorName": "Black",
          "hexCode": "#000000"
        },
        {
          "id": 2,
          "colorName": "White",
          "hexCode": "#FFFFFF"
        }
      ],
      "specifications": [
        {
          "id": 1,
          "specName": "Material",
          "specValue": "Leather"
        },
        {
          "id": 2,
          "specName": "Size",
          "specValue": "42"
        }
      ],
      "images": [
        {
          "id": 1,
          "productId": 1,
          "imageUrl": "https://res.cloudinary.com/example/image/upload/v1234567890/product1.jpg",
          "altText": "Nike Air Max 90 - Front view",
          "isPrimary": true
        },
        {
          "id": 2,
          "productId": 1,
          "imageUrl": "https://res.cloudinary.com/example/image/upload/v1234567890/product1-side.jpg",
          "altText": "Nike Air Max 90 - Side view",
          "isPrimary": false
        }
      ],
      "averageRating": 4.5,
      "totalReviews": 24,
      "createdAt": "2024-01-01T10:00:00Z"
    }
  ]
}
```

---

## 2. Get Product By ID (Lấy thông tin product theo ID)

**Endpoint:** `GET /api/products/{id}`

**Authentication:** Không cần

**Path Parameters:**
- `id` (long): ID của product

**Success Response (200):**
```json
{
  "success": true,
  "message": "Get product successfully",
  "data": {
    "id": 1,
    "name": "Nike Air Max 90",
    "slug": "nike-air-max-90",
    "description": "Classic running shoes",
    "price": 120.00,
    "discountPrice": 99.99,
    "stockQuantity": 50,
    "isActive": true,
    "categoryId": 1,
    "categoryName": "Shoes",
    "brandId": 1,
    "brandName": "Nike",
    "colors": [
      {
        "id": 1,
        "colorName": "Black",
        "hexCode": "#000000"
      }
    ],
    "specifications": [
      {
        "id": 1,
        "specName": "Material",
        "specValue": "Leather"
      }
    ],
    "images": [
      {
        "id": 1,
        "productId": 1,
        "imageUrl": "https://res.cloudinary.com/example/image/upload/v1234567890/product1.jpg",
        "altText": "Nike Air Max 90 - Front view",
        "isPrimary": true
      },
      {
        "id": 2,
        "productId": 1,
        "imageUrl": "https://res.cloudinary.com/example/image/upload/v1234567890/product1-side.jpg",
        "altText": "Nike Air Max 90 - Side view",
        "isPrimary": false
      }
    ],
    "averageRating": 4.5,
    "totalReviews": 24,
    "createdAt": "2024-01-01T10:00:00Z"
  }
}
```

**Error Responses:**
- `404`: Product not found

---

## 3. Create Product (Tạo product mới)

**Endpoint:** `POST /api/products`

**Authentication:** Cần (Admin role)

**Request Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Nike Air Max 90",
  "description": "Classic running shoes",
  "price": 120.00,
  "discountPrice": 99.99,
  "stockQuantity": 50,
  "categoryId": 1,
  "brandId": 1,
  "colorIds": [1, 2],
  "specifications": [
    {
      "specName": "Material",
      "specValue": "Leather"
    },
    {
      "specName": "Size",
      "specValue": "42"
    }
  ]
}
```

**Validation:**
- `name`: Required, không được trống
- `description`: Optional, có thể null
- `price`: Required, phải là số dương
- `discountPrice`: Optional, có thể null
- `stockQuantity`: Required, phải là số nguyên dương
- `categoryId`: Required, phải tồn tại trong database
- `brandId`: Required, phải tồn tại trong database
- `colorIds`: Required, phải có ít nhất 1 màu, tất cả màu phải tồn tại trong database
- `specifications`: Optional, mảng các specification
  - `specName`: Required
  - `specValue`: Required

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 1,
    "name": "Nike Air Max 90",
    "slug": "nike-air-max-90",
    "description": "Classic running shoes",
    "price": 120.00,
    "discountPrice": 99.99,
    "stockQuantity": 50,
    "isActive": true,
    "categoryId": 1,
    "categoryName": "Shoes",
    "brandId": 1,
    "brandName": "Nike",
    "colors": [
      {
        "id": 1,
        "colorName": "Black",
        "hexCode": "#000000"
      },
      {
        "id": 2,
        "colorName": "White",
        "hexCode": "#FFFFFF"
      }
    ],
    "specifications": [
      {
        "id": 1,
        "specName": "Material",
        "specValue": "Leather"
      }
    ],
    "images": [],
    "averageRating": 0,
    "totalReviews": 0,
    "createdAt": "2024-01-01T10:00:00Z"
  }
}
```

**Error Responses:**
- `400`: Brand không tồn tại
- `400`: Category không tồn tại
- `400`: Phải chọn ít nhất 1 màu
- `400`: Một hoặc nhiều màu không tồn tại
- `400`: Validation errors
  ```json
  {
    "success": false,
    "message": "Dữ liệu không hợp lệ",
    "data": [
      { "field": "name", "message": "The Name field is required." }
    ]
  }
  ```
- `401`: Unauthorized (thiếu hoặc token không hợp lệ)
- `403`: Forbidden (không có quyền Admin)

**Lưu ý:** 
- Slug được tự động tạo từ tên product (URL-friendly)
- Nếu slug đã tồn tại, sẽ tự động thêm số phía sau (ví dụ: `nike-air-max-90-1`)

---

## 4. Update Product (Cập nhật product)

**Endpoint:** `PUT /api/products/{id}`

**Authentication:** Cần (Admin role)

**Request Headers:**
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Path Parameters:**
- `id` (long): ID của product cần cập nhật

**Request Body:**
```json
{
  "name": "Nike Air Max 90 Updated",
  "description": "Updated description",
  "price": 130.00,
  "discountPrice": 109.99,
  "stockQuantity": 60,
  "isActive": true,
  "categoryId": 1,
  "brandId": 1,
  "colorIds": [1, 3],
  "specifications": [
    {
      "specName": "Material",
      "specValue": "Synthetic Leather"
    }
  ]
}
```

**Validation:**
- `name`: Required, không được trống
- `description`: Optional, có thể null
- `price`: Required, phải là số dương
- `discountPrice`: Optional, có thể null
- `stockQuantity`: Required, phải là số nguyên dương
- `isActive`: Optional, boolean
- `categoryId`: Required, phải tồn tại trong database
- `brandId`: Required, phải tồn tại trong database
- `colorIds`: Optional, nếu truyền thì tất cả màu phải tồn tại trong database
- `specifications`: Optional
  - `null`: Không thay đổi specifications hiện tại
  - `[]`: Xóa tất cả specifications
  - `[{...}]`: Thay thế toàn bộ specifications bằng danh sách mới
  - `specName`: Required
  - `specValue`: Required

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": 1,
    "name": "Nike Air Max 90 Updated",
    "slug": "nike-air-max-90-updated",
    "description": "Updated description",
    "price": 130.00,
    "discountPrice": 109.99,
    "stockQuantity": 60,
    "isActive": true,
    "categoryId": 1,
    "categoryName": "Shoes",
    "brandId": 1,
    "brandName": "Nike",
    "colors": [
      {
        "id": 1,
        "colorName": "Black",
        "hexCode": "#000000"
      },
      {
        "id": 3,
        "colorName": "Red",
        "hexCode": "#FF0000"
      }
    ],
    "specifications": [
      {
        "id": 2,
        "specName": "Material",
        "specValue": "Synthetic Leather"
      }
    ],
    "images": [
      {
        "id": 3,
        "productId": 1,
        "imageUrl": "https://res.cloudinary.com/example/image/upload/v1234567890/product1-updated.jpg",
        "altText": "Nike Air Max 90 Updated - Front view",
        "isPrimary": true
      }
    ],
    "averageRating": 4.5,
    "totalReviews": 24,
    "createdAt": "2024-01-01T10:00:00Z"
  }
}
```

**Error Responses:**
- `404`: Product not found
- `400`: Một hoặc nhiều màu không tồn tại (nếu truyền colorIds)
- `400`: Validation errors
- `401`: Unauthorized (thiếu hoặc token không hợp lệ)
- `403`: Forbidden (không có quyền Admin)

**Lưu ý về Specifications:**
- Nếu không truyền field `specifications` (null) → Giữ nguyên specifications hiện tại
- Nếu truyền mảng rỗng `[]` → Xóa tất cả specifications
- Nếu truyền mảng có phần tử `[{...}]` → Thay thế toàn bộ specifications bằng danh sách mới

**Lưu ý về Colors:**
- Nếu không truyền field `colorIds` (null) → Giữ nguyên colors hiện tại
- Nếu truyền mảng `[1, 2, 3]` → Thay thế toàn bộ colors bằng danh sách mới

**Lưu ý về Slug:**
- Nếu tên product thay đổi, slug sẽ được tự động tạo lại từ tên mới
- Nếu slug mới đã tồn tại (bởi product khác), sẽ tự động thêm số phía sau

---

## 5. Delete Product (Xóa product)

**Endpoint:** `DELETE /api/products/{id}`

**Authentication:** Cần (Admin role)

**Request Headers:**
```
Authorization: Bearer {accessToken}
```

**Path Parameters:**
- `id` (long): ID của product cần xóa

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": null
}
```

**Error Responses:**
- `404`: Product not found
- `401`: Unauthorized (thiếu hoặc token không hợp lệ)
- `403`: Forbidden (không có quyền Admin)

---

## Product Query DTO Structure

```typescript
interface ProductQueryDto {
  brandId?: number;              // Lọc theo Brand ID
  categoryId?: number;            // Lọc theo Category ID
  minPrice?: number;             // Giá tối thiểu (>= 0)
  maxPrice?: number;             // Giá tối đa (>= 0)
  sortBy?: string;               // Sắp xếp theo: "createdAt" | "price" | "name" (mặc định: "createdAt")
  sortDir?: string;              // Hướng sắp xếp: "asc" | "desc" (mặc định: "desc")
}
```

---

## Product Response DTO Structure

```typescript
interface ProductResponseDto {
  id: number;                    // ID của product
  name: string;                  // Tên product
  slug: string;                  // URL-friendly slug (tự động tạo)
  description: string | null;    // Mô tả product
  price: number;                 // Giá gốc
  discountPrice: number | null;  // Giá khuyến mãi (nếu có)
  stockQuantity: number;         // Số lượng tồn kho
  isActive: boolean;             // Trạng thái active/inactive
  categoryId: number | null;     // ID category
  categoryName: string | null;   // Tên category
  brandId: number | null;        // ID brand
  brandName: string | null;      // Tên brand
  colors: ProductColorResponseDto[];  // Danh sách màu
  specifications: ProductSpecificationResponseDto[];  // Danh sách thông số kỹ thuật
  images: ProductImageResponseDto[];  // Danh sách hình ảnh sản phẩm
  averageRating: number;         // Điểm đánh giá trung bình (0-5, làm tròn 2 chữ số thập phân)
  totalReviews: number;          // Tổng số lượng review
  createdAt: string;            // Ngày tạo (ISO 8601 format)
}

interface ProductColorResponseDto {
  id: number;                    // ID của color
  colorName: string;             // Tên màu
  hexCode: string | null;        // Mã màu hex (ví dụ: #000000)
}

interface ProductSpecificationResponseDto {
  id: number;                    // ID của specification
  specName: string;              // Tên thông số (ví dụ: "Material", "Size")
  specValue: string;            // Giá trị thông số (ví dụ: "Leather", "42")
}

interface ProductImageResponseDto {
  id: number;                    // ID của hình ảnh
  productId: number;             // ID của sản phẩm
  imageUrl: string;              // URL của hình ảnh (Cloudinary hoặc CDN)
  altText: string | null;        // Mô tả hình ảnh (cho accessibility)
  isPrimary: boolean;            // Có phải hình ảnh chính không
}
```

---

## Ví dụ Frontend (JavaScript/Fetch)

### Get All Products
```javascript
// Lấy tất cả products
const response = await fetch('https://api.example.com/api/products', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
});

const data = await response.json();
if (data.success) {
  console.log(data.data); // Array of products
}
```

### Get All Products với Filter
```javascript
// Lọc theo brandId, categoryId và khoảng giá
const queryParams = new URLSearchParams({
  brandId: '4',
  categoryId: '1',
  minPrice: '15044245',
  maxPrice: '31821531'
});

const response = await fetch(`https://api.example.com/api/products?${queryParams}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
});

const data = await response.json();
if (data.success) {
  console.log(data.data); // Array of filtered products
}
```

### Get All Products với Sorting
```javascript
// Sắp xếp theo giá tăng dần
const queryParams = new URLSearchParams({
  sortBy: 'price',
  sortDir: 'asc'
});

const response = await fetch(`https://api.example.com/api/products?${queryParams}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
});

const data = await response.json();
if (data.success) {
  console.log(data.data); // Array of products sorted by price ascending
}
```

### Get Product By ID
```javascript
const productId = 1;
const response = await fetch(`https://api.example.com/api/products/${productId}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
});

const data = await response.json();
if (data.success) {
  console.log(data.data); // Product object
}
```

### Create Product
```javascript
const accessToken = localStorage.getItem('accessToken');
const response = await fetch('https://api.example.com/api/products', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Nike Air Max 90',
    description: 'Classic running shoes',
    price: 120.00,
    discountPrice: 99.99,
    stockQuantity: 50,
    categoryId: 1,
    brandId: 1,
    colorIds: [1, 2],
    specifications: [
      {
        specName: 'Material',
        specValue: 'Leather'
      },
      {
        specName: 'Size',
        specValue: '42'
      }
    ]
  })
});

const data = await response.json();
if (data.success) {
  console.log('Product created:', data.data);
}
```

### Update Product
```javascript
const accessToken = localStorage.getItem('accessToken');
const productId = 1;
const response = await fetch(`https://api.example.com/api/products/${productId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Nike Air Max 90 Updated',
    description: 'Updated description',
    price: 130.00,
    discountPrice: 109.99,
    stockQuantity: 60,
    isActive: true,
    categoryId: 1,
    brandId: 1,
    colorIds: [1, 3],  // Thay thế toàn bộ colors
    specifications: [  // Thay thế toàn bộ specifications
      {
        specName: 'Material',
        specValue: 'Synthetic Leather'
      }
    ]
  })
});

const data = await response.json();
if (data.success) {
  console.log('Product updated:', data.data);
}
```

### Update Product - Giữ nguyên Specifications
```javascript
const accessToken = localStorage.getItem('accessToken');
const productId = 1;
const response = await fetch(`https://api.example.com/api/products/${productId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Nike Air Max 90 Updated',
    price: 130.00,
    stockQuantity: 60,
    categoryId: 1,
    brandId: 1
    // Không truyền specifications → giữ nguyên
    // Không truyền colorIds → giữ nguyên
  })
});

const data = await response.json();
if (data.success) {
  console.log('Product updated:', data.data);
}
```

### Update Product - Xóa tất cả Specifications
```javascript
const accessToken = localStorage.getItem('accessToken');
const productId = 1;
const response = await fetch(`https://api.example.com/api/products/${productId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Nike Air Max 90',
    price: 130.00,
    stockQuantity: 60,
    categoryId: 1,
    brandId: 1,
    specifications: []  // Mảng rỗng → xóa tất cả specifications
  })
});

const data = await response.json();
if (data.success) {
  console.log('Product updated:', data.data);
}
```

### Delete Product
```javascript
const accessToken = localStorage.getItem('accessToken');
const productId = 1;
const response = await fetch(`https://api.example.com/api/products/${productId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  }
});

const data = await response.json();
if (data.success) {
  console.log('Product deleted successfully');
}
```

---

## Status Codes

- `200`: Success
- `400`: Bad Request (validation errors, business logic errors)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (resource not found)
- `500`: Internal Server Error

---

## Business Rules

1. **Slug tự động:** Slug được tự động tạo từ tên product, nếu trùng sẽ thêm số phía sau
2. **Màu bắt buộc:** Khi tạo product mới, phải chọn ít nhất 1 màu
3. **Specifications:** 
   - Khi tạo: Optional, có thể không có
   - Khi update: 
     - `null` → Giữ nguyên
     - `[]` → Xóa tất cả
     - `[{...}]` → Thay thế toàn bộ
4. **Colors khi update:**
   - `null` → Giữ nguyên
   - `[1, 2, 3]` → Thay thế toàn bộ
5. **Phân quyền:** Chỉ Admin mới có thể Create, Update, Delete product
6. **Get operations:** Tất cả user đều có thể xem danh sách và chi tiết product
7. **Validation:** BrandId, CategoryId, ColorIds phải tồn tại trong database
8. **Hình ảnh sản phẩm:**
   - Hình ảnh được quản lý riêng qua API `/api/product-images`
   - Khi lấy danh sách hoặc chi tiết product, tất cả hình ảnh của sản phẩm sẽ được trả về trong field `images`
   - Field `images` là mảng rỗng `[]` nếu sản phẩm chưa có hình ảnh
   - Mỗi hình ảnh có thể được đánh dấu là `isPrimary: true` để làm hình ảnh chính
9. **Thống kê Review:**
   - `averageRating`: Điểm đánh giá trung bình từ 1-5, làm tròn 2 chữ số thập phân
   - `totalReviews`: Tổng số lượng review của sản phẩm
   - Nếu sản phẩm chưa có review, `averageRating` sẽ là `0` và `totalReviews` sẽ là `0`
   - Thông tin này được tính toán tự động từ tất cả các review của sản phẩm
10. **Filter và Sorting:**
    - API Get All Products hỗ trợ filter theo `brandId`, `categoryId`, `minPrice`, `maxPrice`
    - Hỗ trợ sorting theo `createdAt`, `price`, `name` với hướng `asc` hoặc `desc`
    - Tất cả query parameters đều optional, có thể kết hợp nhiều filter cùng lúc
    - Khi filter theo giá, sử dụng giá gốc (`price`) chứ không phải giá khuyến mãi (`discountPrice`)