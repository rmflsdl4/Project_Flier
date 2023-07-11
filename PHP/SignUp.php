<?php
    //include_once('DB_Connect.php');
    function DuplicateCheck($value){
        $host = 'svc.sel4.cloudtype.app';
        $user = 'root';
        $password = 'tkfkdgo3@';
        $database = 'flier';
        $port = '32388';

        $conn = new mysqli($host, $user, $password, $database, $port);

        $query = "SELECT * FROM users WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $value);
        $stmt->execute();
        $result = $stmt->get_result();
        $bool = ($result->num_rows == 0);
        $stmt->close();
        $conn->close();
        return $bool;
    }
    $id = $_POST['id'];
    $result = !DuplicateCheck($id);
    $response = json_encode($result);
    echo $response;
    /*if(isset($_POST['id'], $_POST['pw'], $_POST['confirm_pw'], $_POST['nick_name'])){
        $id = $_POST['id'];
        $pw = $_POST['pw'];
        $confirm_pw = $_POST['confirm_pw'];
        $nick_name = $_POST['nick_name'];

        $query = "SELECT * FROM users WHERE id = ?";
        $stmt = mysqli_prepare($conn, $query);

        mysqli_stmt_bind_param($stmt, 's', $id);

        $result = mysqli_stmt_get_result($stmt);

        if(mysqli_num_rows($result) > 0){
            mysqli_stmt_close($stmt);
            mysqli_close($conn);
            echo "<script>
            alert('회원가입에 실패하였습니다.');
            window.location.href = 'https://web-project-flier-k19y2kljvm1qyo.sel4.cloudtype.app/Login.html';
            </script>";
            exit;
        }
        else{
            $query = "INSERT INTO users(id, pw, nick_name) VALUES (?, ? ,?)";

            $stmt = mysqli_prepare($conn, $query);
            
            mysqli_stmt_bind_param($stmt, 'sss', $id, $pw, $nick_name);
    
            $result = mysqli_stmt_execute($stmt);
    
            if (mysqli_affected_rows($conn) > 0) {
                echo "<script>
                alert('회원가입이 완료되었습니다.');
                </script>";
            }
            
            mysqli_stmt_close($stmt);
            mysqli_close($conn);
            echo "<script>
            window.location.href = 'https://web-project-flier-k19y2kljvm1qyo.sel4.cloudtype.app/Login.html';
            </script>";
        }
    }*/
?>