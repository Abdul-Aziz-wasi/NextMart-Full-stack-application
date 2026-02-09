NextMart – Smart Delivery & Ordering Platform

NextMart is a full-stack web application that connects customers, delivery boys, and admins in a real-time product ordering and delivery system.
All users must create an account first by selecting a role (Customer or Delivery Boy).
Admins manage the platform through a dedicated admin dashboard.

 Authentication & Role Selection
Users must register and log in
During registration, users choose one of the following roles:
Customer
Delivery Boy

Access to dashboards and features is strictly role-based
Admin accounts are pre-defined or managed separately
Features Overview

Customer Role
Register and log in as Customer
Browse and order products
Secure online payment using Stripe
Real-time delivery tracking
Live chat with assigned delivery boy
Get AI-powered chat suggestions
Receive OTP and share it with delivery boy to confirm delivery

 Delivery Boy Role
Register and log in as Delivery Boy
View assigned deliveries
Track customer live location
Real-time chat with customer
Complete delivery using OTP verification
View total earnings and delivery history from dashboard

 Admin Role
Access admin dashboard
Manage all deliveries
Monitor real-time delivery updates
View all users (customers & delivery boys)
Oversee platform activity and order status

 AI Chat Assistance
AI provides smart reply suggestions during chat
Helps improve communication between customer and delivery boy
Integrated directly into real-time chat system

Payment System
Secure payments using Stripe
Orders are confirmed only after successful payment
Payment status is tracked and stored

📍 Real-Time Tracking & Chat
Live location tracking
Real-time messaging using Socket.IO
Instant delivery status updates

🧩 Tech Stack
Frontend
Next.js
Tailwind CSS
Socket.IO Client
Stripe.js

Backend
Node.js
Express.js
MongoDB
Socket.IO
Stripe API
AI API (Gemini / OpenAI)

Authentication
JWT / Firebase Authentication
Role-based authorization (Customer, Delivery Boy, Admin)

 Order & Delivery Flow

User registers and selects a role
Customer places an order
Payment completed via Stripe
Delivery boy is assigned
Real-time tracking & chat enabled
Customer provides OTP
Delivery boy completes delivery
Earnings updated in delivery boy dashboard

 Dashboards
Customer Dashboard: Orders, payments, tracking
Delivery Boy Dashboard: Deliveries, earnings, tracking
Admin Dashboard: Platform monitoring and management

## Deploy on Vercel

