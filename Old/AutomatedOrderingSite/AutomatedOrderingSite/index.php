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

// Function to check and order food stock if necessary
function checkAndOrderFoodStock($link)
{
    echo "Inside checkAndOrderFoodStock function.<br>";

    $sql = "SELECT * FROM food_stock";
    $result = $link->query($sql);

    if ($result->num_rows > 0) {
        echo "Food stock available. <br>";
        $total_boxes_needed = 0; // Initialize total boxes needed
        while ($row = $result->fetch_assoc()) {
            $item_id = $row["id"]; // Assuming you have an ID column in your food_stock table
            $item_name = $row["item_name"];
            $quantity = $row["quantity"];
            $min_threshold = $row["min_threshold"];
            $items_per_box = $row["items_per_box"];

            // Calculate available quantity in terms of items
            $available_items = $quantity;
            // Calculate boxes needed for this item
            $available_boxes = floor($quantity / $items_per_box);
            $boxes_needed = max(0, ceil(($min_threshold - $available_items) / $items_per_box));
            $total_boxes_needed += $boxes_needed; // Accumulate total boxes needed

            // Perform ordering logic here (send notification, place order, update database, etc.)
            // For simplicity, let's just echo a message
            if ($boxes_needed > 0) {
                echo "Low stock for item: $item_name. Ordering $boxes_needed boxes.<br>";

                // Update quantity in the database
                $new_quantity = $quantity + ($boxes_needed * $items_per_box);
                $update_sql = "UPDATE food_stock SET quantity = $new_quantity WHERE id = $item_id";
                if ($link->query($update_sql) === TRUE) {
                    echo "Quantity updated successfully.<br>";
                } else {
                    echo "Error updating quantity: " . $link->error . "<br>"; // Display error message
                }
            }
        }
        echo "Total boxes needed: $total_boxes_needed<br>";
    } else {
        echo "No food stock available.<br>";
    }
}

// Check if the form is submitted and the order button is clicked
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    echo "Form submitted.<br>";
    if (isset($_POST['order'])) {
        echo "Order button clicked. ";
        // Call the function to check and order food stock
        checkAndOrderFoodStock($link);
    }
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
    <div class="table-container">
    <!-- Display current stock in a centered table -->
    <?php
    // Retrieve current stock from the database
    $sql = "SELECT * FROM food_stock";
    $result = $link->query($sql);

    if ($result->num_rows > 0) {
        echo "<table>";
        echo "<tr><th>Item Name</th><th>Quantity</th><th>Items per Box</th></tr>";
        while ($row = $result->fetch_assoc()) {
            echo "<tr>";
            echo "<td>" . $row["item_name"] . "</td>";
            echo "<td>" . $row["quantity"] . "</td>";
            echo "<td>" . $row["items_per_box"] . "</td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "No food stock available.";
    }
    ?>
    </div>

    <!-- Button to trigger ordering -->
    <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
        <input type="submit" name="order" value="Order Food Stock" class="btn btn-success">
    </form>
</body>

</html>