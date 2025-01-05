<?php
// Initialize the session
session_start();

// Include database configuration
include 'loginSystem/config.php';

// Check if the user is logged in, if not then redirect him to login page
if (!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true) {
    header("location: loginSystem/login.php");
    exit;
}

// Delete Product Logic
if (isset($_POST['delete'])) {
    $id = $_POST['id']; // Get the ID of the product to delete

    // Delete product from the database
    $delete_sql = "DELETE FROM food_stock WHERE id = $id";
    if ($link->query($delete_sql) === TRUE) {
        echo "Product deleted successfully.";
        // Refresh the page after deletion
        echo "<meta http-equiv='refresh' content='0'>";
    } else {
        echo "Error deleting product: " . $link->error;
    }
}

// Add Product Logic
if (isset($_POST['add'])) {
    // Perform necessary actions to add a new product (not implemented here)
    // Redirect or refresh the page after adding the product
    echo "<meta http-equiv='refresh' content='0'>";
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Welcome</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.css">
    <style type="text/css">
        body {
            font-family: Arial, sans-serif;
            text-align: center;
        }

        .navbar {
            margin-bottom: 20px; /* Add space below the navigation bar */
        }

        .table-container {
            margin: auto;
            width: 80%;
            max-width: 800px;
            height: 300px; /* Set the height of the table container */
            overflow-y: auto; /* Add vertical scroll bar */
            border-radius: 8px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }

        table {
            border-collapse: collapse;
            width: 100%;
        }

        th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }

        th {
            background-color: #f2f2f2;
            color: #333;
            text-transform: uppercase;
        }

        tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        tr:hover {
            background-color: #f2f2f2;
        }

        .btn {
            margin-top: 20px;
        }
    </style>
</head>

<body>
    <div class="navbar">
        <div class="page-header">
            <h1>Hi, <b><?php echo htmlspecialchars($_SESSION["username"]); ?></b>. Welcome to our Ordering Site.</h1>
        </div>
        <p align="left" style="float: left; padding-left: 50px">
            <a href="index.php" class="btn btn-warning">Home Page</a>
            <a href="inventoryViewer.php" class="btn btn-danger">Inventory Viewer</a>
        </p>
        <p align="right" style="float: right; padding-right: 50px">
            <a href="loginSystem/reset-password.php" class="btn btn-warning">Reset Your Password</a>
            <a href="loginSystem/logout.php" class="btn btn-danger">Sign Out of Your Account</a>
        </p>
    </div>

    <!-- Display current stock in a centered table -->
    <div class="table-container">
        <?php
        // Retrieve current stock from the database
        $sql = "SELECT * FROM food_stock";
        $result = $link->query($sql);

        if ($result->num_rows > 0) {
            echo "<table>";
            echo "<tr><th>Item Name</th><th>Quantity</th><th>Items per Box</th><th>Action</th></tr>";
            while ($row = $result->fetch_assoc()) {
                echo "<tr>";
                echo "<td>" . $row["item_name"] . "</td>";
                echo "<td>" . $row["quantity"] . "</td>";
                echo "<td>" . $row["items_per_box"] . "</td>";
                echo "<td>";
                echo "<form method='post' action='" . htmlspecialchars($_SERVER["PHP_SELF"]) . "'>";
                echo "<input type='hidden' name='id' value='" . $row["id"] . "'>";
                echo "<input type='submit' name='delete' class='btn btn-danger' value='Delete'>";
                echo "</form>";
                echo "</td>";
                echo "</tr>";
            }
            echo "</table>";
        } else {
            echo "No food stock available.";
        }
        ?>
    </div>

</body>

</html>