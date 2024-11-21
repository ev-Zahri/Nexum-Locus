Berikut adalah jawaban untuk pertanyaan Anda:

---

## **1. Daftar API yang Dibuat oleh Backend**  

### **Daftar Endpoint API**
Setiap API dijelaskan dengan endpoint, metode HTTP, deskripsi, request, dan responsnya.

---

### **1.1. User Management**  
#### a. **Register User**  
- **Endpoint:** `POST /api/users/register`  
- **Deskripsi:** Mendaftarkan pengguna baru ke sistem.  
- **Request:**  
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "securepassword"
  }
  ```  
- **Response (Success):**  
  ```json
  {
    "message": "User registered successfully",
    "user_id": 1
  }
  ```  
- **Response (Error):**  
  ```json
  {
    "error": "Email already exists"
  }
  ```

#### b. **Login User**  
- **Endpoint:** `POST /api/users/login`  
- **Deskripsi:** Mengotentikasi pengguna.  
- **Request:**  
  ```json
  {
    "email": "john.doe@example.com",
    "password": "securepassword"
  }
  ```  
- **Response (Success):**  
  ```json
  {
    "message": "Login successful",
    "token": "jwt_token_string"
  }
  ```  
- **Response (Error):**  
  ```json
  {
    "error": "Invalid email or password"
  }
  ```

#### c. **Get User Profile**  
- **Endpoint:** `GET /api/users/profile`  
- **Deskripsi:** Mendapatkan profil pengguna berdasarkan token.  
- **Headers:**  
  `Authorization: Bearer <token>`  
- **Response:**  
  ```json
  {
    "user_id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
  ```

---

### **1.2. Event/Transport Management**  
#### a. **Get All Events/Transport**  
- **Endpoint:** `GET /api/events`  
- **Deskripsi:** Mendapatkan semua daftar acara atau transportasi.  
- **Response:**  
  ```json
  [
    {
      "id": 1,
      "title": "Music Concert",
      "location": "Jakarta",
      "date": "2024-11-30",
      "price": 50000
    },
    {
      "id": 2,
      "title": "Train to Bandung",
      "location": "Jakarta",
      "date": "2024-12-01",
      "price": 150000
    }
  ]
  ```

#### b. **Get Event/Transport Details**  
- **Endpoint:** `GET /api/events/:id`  
- **Deskripsi:** Mendapatkan detail acara atau transportasi berdasarkan ID.  
- **Response:**  
  ```json
  {
    "id": 1,
    "title": "Music Concert",
    "description": "Live concert with popular artists.",
    "location": "Jakarta",
    "date": "2024-11-30",
    "price": 50000,
    "seats_available": 100
  }
  ```

---

### **1.3. Booking Management**  
#### a. **Create Booking**  
- **Endpoint:** `POST /api/bookings`  
- **Deskripsi:** Membuat pemesanan tiket.  
- **Request:**  
  ```json
  {
    "event_id": 1,
    "quantity": 2
  }
  ```  
- **Response (Success):**  
  ```json
  {
    "message": "Booking successful",
    "booking_id": 123,
    "total_price": 100000
  }
  ```  
- **Response (Error):**  
  ```json
  {
    "error": "Seats not available"
  }
  ```

#### b. **Get User Bookings**  
- **Endpoint:** `GET /api/bookings`  
- **Deskripsi:** Mendapatkan semua pemesanan tiket pengguna.  
- **Headers:**  
  `Authorization: Bearer <token>`  
- **Response:**  
  ```json
  [
    {
      "booking_id": 123,
      "event": {
        "title": "Music Concert",
        "date": "2024-11-30"
      },
      "quantity": 2,
      "total_price": 100000
    }
  ]
  ```

---

### **1.4. Payment Management**  
#### a. **Initiate Payment**  
- **Endpoint:** `POST /api/payments`  
- **Deskripsi:** Menginisialisasi proses pembayaran.  
- **Request:**  
  ```json
  {
    "booking_id": 123,
    "payment_method": "credit_card"
  }
  ```  
- **Response (Success):**  
  ```json
  {
    "message": "Payment initiated",
    "payment_url": "https://payment-gateway.com/checkout"
  }
  ```  
- **Response (Error):**  
  ```json
  {
    "error": "Invalid booking ID"
  }
  ```

---

## **2. Model Database**  

Berikut adalah model database yang diperlukan untuk aplikasi ini:  

---

### **2.1. Tabel `users`**  
Menyimpan data pengguna.  
| **Kolom**        | **Tipe**       | **Deskripsi**             |
|-------------------|----------------|---------------------------|
| id               | INT (PK)       | Primary key.              |
| username             | VARCHAR(100)   | Nama pengguna.            |
| email            | VARCHAR(100)   | Email unik pengguna.      |
| password         | VARCHAR(100)   | Hash password.            |
| address         | VARCHAR(255)   | Alamat rumah (Opsional).            |
| dateOfBirth         | DATE   |  Tanggal lahir. (Opsional)           |
| created_at         | DATE   | Date.            |
| update_at         | DATE   | Date.            |

---

### **2.2. Tabel `events`**  
Menyimpan data acara/transportasi.  
| **Kolom**        | **Tipe**       | **Deskripsi**             |
|-------------------|----------------|---------------------------|
| id               | INT (PK)       | Primary key.              |
| title            | VARCHAR(255)   | Judul acara.              |
| description      | TEXT           | Deskripsi acara.          |
| location         | VARCHAR(255)   | Lokasi acara.             |
| date             | DATE           | Tanggal acara.            |
| price            | DECIMAL(10,2)  | Harga tiket.              |
| seats_available  | INT            | Jumlah kursi tersedia.    |

---

### **2.3. Tabel `bookings`**  
Menyimpan data pemesanan tiket.  
| **Kolom**        | **Tipe**       | **Deskripsi**             |
|-------------------|----------------|---------------------------|
| id               | INT (PK)       | Primary key.              |
| user_id          | INT (FK)       | ID pengguna.              |
| event_id         | INT (FK)       | ID acara.                 |
| quantity         | INT            | Jumlah tiket dipesan.     |
| total_price      | DECIMAL(10,2)  | Total harga.              |
| status           | VARCHAR(50)    | Status pemesanan.         |

---

### **2.4. Tabel `payments`**  
Menyimpan data pembayaran.  
| **Kolom**        | **Tipe**       | **Deskripsi**             |
|-------------------|----------------|---------------------------|
| id               | INT (PK)       | Primary key.              |
| booking_id       | INT (FK)       | ID pemesanan.             |
| payment_method   | VARCHAR(50)    | Metode pembayaran.        |
| payment_status   | VARCHAR(50)    | Status pembayaran.        |
| payment_url      | TEXT           | URL pembayaran.           |

---

### **Relasi Antar Tabel**  
1. **users** ↔ **bookings**: *One-to-Many* (1 pengguna dapat memiliki banyak pemesanan).  
2. **events** ↔ **bookings**: *One-to-Many* (1 acara dapat dipesan oleh banyak pengguna).  
3. **bookings** ↔ **payments**: *One-to-One* (1 pemesanan memiliki 1 pembayaran).  

--- 
