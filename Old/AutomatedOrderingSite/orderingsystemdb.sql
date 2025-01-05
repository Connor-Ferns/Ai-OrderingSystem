-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 07, 2024 at 12:10 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `orderingsystemdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `food_stock`
--

CREATE TABLE `food_stock` (
  `id` int(11) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `min_threshold` int(11) NOT NULL,
  `items_per_box` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `food_stock`
--

INSERT INTO `food_stock` (`id`, `item_name`, `quantity`, `min_threshold`, `items_per_box`) VALUES
(1, 'Cadbury Chocolate', 10, 10, 5),
(2, 'Waffles', 11, 5, 10),
(4, 'Cheese', 24, 20, 5),
(5, 'Apples', 15, 10, 12),
(6, 'Oranges', 23, 10, 15),
(7, 'Bananas', 22, 15, 10),
(8, 'Bread', 30, 30, 5),
(9, 'Milk', 25, 20, 6),
(10, 'Eggs', 30, 25, 12),
(11, 'Yogurt', 18, 15, 8),
(12, 'Cheese', 18, 15, 10),
(13, 'Potatoes', 22, 20, 15),
(14, 'Carrots', 16, 10, 20),
(15, 'Chicken', 22, 20, 4),
(16, 'Beef', 25, 25, 5),
(17, 'Fish', 18, 15, 8),
(18, 'Rice', 28, 20, 10),
(19, 'Pasta', 31, 30, 6),
(20, 'Tomatoes', 20, 15, 12),
(21, 'Onions', 15, 10, 18),
(22, 'Spinach', 12, 8, 20);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`) VALUES
(1, 'Connor', '$2y$10$SQGJtIv5o94rTqCtJSUYoO/hXEba2WSapFwdE/N/UfX1.yjvOVYwW');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `food_stock`
--
ALTER TABLE `food_stock`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `food_stock`
--
ALTER TABLE `food_stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
