CREATE DATABASE IF NOT EXISTS north_star_markets;
USE north_star_markets;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(80) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('client', 'admin') NOT NULL DEFAULT 'client',
  balance DECIMAL(14, 2) NOT NULL DEFAULT 0,
  first_name VARCHAR(100) NULL,
  last_name VARCHAR(100) NULL,
  phone VARCHAR(60) NULL,
  id_type VARCHAR(60) NULL,
  id_number VARCHAR(60) NULL,
  country VARCHAR(100) NULL,
  date_of_birth DATE NULL,
  annual_income VARCHAR(100) NULL,
  net_worth VARCHAR(100) NULL,
  employment_status VARCHAR(100) NULL,
  source_of_funds VARCHAR(120) NULL,
  us_citizen VARCHAR(10) NULL,
  pep_status VARCHAR(10) NULL,
  tax_residency VARCHAR(120) NULL,
  risk_tolerance VARCHAR(40) NULL,
  investment_horizon VARCHAR(40) NULL,
  max_drawdown VARCHAR(40) NULL,
  years_trading VARCHAR(40) NULL,
  products_traded VARCHAR(120) NULL,
  average_trades_per_month VARCHAR(40) NULL,
  preferred_markets VARCHAR(255) NULL,
  strategy_style VARCHAR(80) NULL,
  preferred_leverage VARCHAR(40) NULL,
  status ENUM('active', 'suspended') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trades (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  symbol VARCHAR(30) NOT NULL,
  ticket_symbol VARCHAR(30) NULL,
  side ENUM('buy', 'sell') NOT NULL,
  volume DECIMAL(10, 2) NOT NULL,
  margin_held DECIMAL(12, 2) NOT NULL DEFAULT 0,
  pnl DECIMAL(12, 2) NOT NULL DEFAULT 0,
  entry_price DECIMAL(12, 4) NULL,
  exit_price DECIMAL(12, 4) NULL,
  status ENUM('open', 'closed') NOT NULL DEFAULT 'open',
  trade_date DATE NULL,
  contract_expiry DATE NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS fund_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type ENUM('deposit', 'withdraw') NOT NULL,
  amount DECIMAL(14, 2) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NULL,
  action VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
