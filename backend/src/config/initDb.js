import mysql from 'mysql2/promise'

export async function initDatabase() {
  const host = process.env.MYSQL_HOST || 'localhost'
  const port = Number(process.env.MYSQL_PORT || 3306)
  const user = process.env.MYSQL_USER || 'root'
  const password = process.env.MYSQL_PASSWORD || ''
  const database = process.env.MYSQL_DATABASE || 'north_star_markets'

  const connection = await mysql.createConnection({ host, port, user, password })

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``)
  await connection.query(`USE \`${database}\``)

  await connection.query(`
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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await connection.query(`
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
    )
  `)

  const [tradeDateColumn] = await connection.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'trades' AND COLUMN_NAME = 'trade_date' LIMIT 1`,
    [database],
  )

  if (!tradeDateColumn.length) {
    await connection.query('ALTER TABLE trades ADD COLUMN trade_date DATE NULL')
  }

  const [ticketSymbolColumn] = await connection.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'trades' AND COLUMN_NAME = 'ticket_symbol' LIMIT 1`,
    [database],
  )

  if (!ticketSymbolColumn.length) {
    await connection.query('ALTER TABLE trades ADD COLUMN ticket_symbol VARCHAR(30) NULL')
  }

  const [contractExpiryColumn] = await connection.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'trades' AND COLUMN_NAME = 'contract_expiry' LIMIT 1`,
    [database],
  )

  if (!contractExpiryColumn.length) {
    await connection.query('ALTER TABLE trades ADD COLUMN contract_expiry DATE NULL')
  }

  const [marginHeldColumn] = await connection.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'trades' AND COLUMN_NAME = 'margin_held' LIMIT 1`,
    [database],
  )

  if (!marginHeldColumn.length) {
    await connection.query('ALTER TABLE trades ADD COLUMN margin_held DECIMAL(12,2) NOT NULL DEFAULT 0')
  }

  const [entryPriceColumn] = await connection.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'trades' AND COLUMN_NAME = 'entry_price' LIMIT 1`,
    [database],
  )

  if (!entryPriceColumn.length) {
    await connection.query('ALTER TABLE trades ADD COLUMN entry_price DECIMAL(12,4) NULL')
  }

  const [exitPriceColumn] = await connection.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'trades' AND COLUMN_NAME = 'exit_price' LIMIT 1`,
    [database],
  )

  if (!exitPriceColumn.length) {
    await connection.query('ALTER TABLE trades ADD COLUMN exit_price DECIMAL(12,4) NULL')
  }

  const [idNumberColumn] = await connection.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'id_number' LIMIT 1`,
    [database],
  )

  if (!idNumberColumn.length) {
    await connection.query('ALTER TABLE users ADD COLUMN id_number VARCHAR(60) NULL')
  }

  const [statusColumn] = await connection.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'status' LIMIT 1`,
    [database],
  )

  if (!statusColumn.length) {
    await connection.query('ALTER TABLE users ADD COLUMN status ENUM(\'active\', \'suspended\') NOT NULL DEFAULT \'active\'')
  }

  const [idTypeColumn] = await connection.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'id_type' LIMIT 1`,
    [database],
  )

  if (!idTypeColumn.length) {
    await connection.query('ALTER TABLE users ADD COLUMN id_type VARCHAR(60) NULL')
  }

  const [verificationStatusColumn] = await connection.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'verification_status' LIMIT 1`,
    [database],
  )

  if (!verificationStatusColumn.length) {
    await connection.query('ALTER TABLE users ADD COLUMN verification_status ENUM(\'pending\', \'verified\', \'rejected\', \'documents_requested\') NOT NULL DEFAULT \'pending\'')
  }

  const [idDocumentColumn] = await connection.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'id_document' LIMIT 1`,
    [database],
  )

  if (!idDocumentColumn.length) {
    await connection.query('ALTER TABLE users ADD COLUMN id_document VARCHAR(255) NULL')
  }

  const [verificationNotesColumn] = await connection.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'verification_notes' LIMIT 1`,
    [database],
  )

  if (!verificationNotesColumn.length) {
    await connection.query('ALTER TABLE users ADD COLUMN verification_notes TEXT NULL')
  }

  const [idFrontColumn] = await connection.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'id_front' LIMIT 1`,
    [database],
  )

  if (!idFrontColumn.length) {
    await connection.query('ALTER TABLE users ADD COLUMN id_front VARCHAR(255) NULL')
  }

  const [idBackColumn] = await connection.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'id_back' LIMIT 1`,
    [database],
  )

  if (!idBackColumn.length) {
    await connection.query('ALTER TABLE users ADD COLUMN id_back VARCHAR(255) NULL')
  }

  const [initialDepositColumn] = await connection.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'initial_deposit' LIMIT 1`,
    [database],
  )

  if (!initialDepositColumn.length) {
    await connection.query('ALTER TABLE users ADD COLUMN initial_deposit DECIMAL(14,2) NOT NULL DEFAULT 0')
  }

  await connection.query(`
    CREATE TABLE IF NOT EXISTS fund_requests (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      type ENUM('deposit', 'withdraw') NOT NULL,
      amount DECIMAL(14, 2) NOT NULL,
      status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)

  await connection.query(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NULL,
      action VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `)

  await connection.end()
}
