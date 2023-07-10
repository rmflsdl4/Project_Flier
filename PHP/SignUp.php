<?php
    include_once('DB_Connect.php');
    
    if(isset($_POST['id'], $_POST['pw'], $_POST['confirm_pw'], $_POST['nick_name'])){
        $id = $_POST['id'];
        $pw = $_POST['pw'];
        $confirm_pw = $_POST['confirm_pw'];
        $nick_name = $_POST['nick_name'];

        $query = "INSERT INTO users(id, pw, nick_name) VALUES (?, ? ,?)";

        $stmt = mysqli_prepare($conn, $query);
        
        mysqli_stmt_bind_param($stmt, 'sss', $id, $pw, $nick_name);

        $result = mysqli_stmt_execute($stmt);

        if (mysqli_affected_rows($conn) > 0) {
            echo "<script>alert('회원가입이 완료되었습니다.');</script>";
        }
        else{
            echo "<script>alert('회원가입에 실패하였습니다.');</script>";
        }
        
        mysqli_stmt_close($stmt);
        mysqli_close($conn);
        header("Location: https://web-project-flier-k19y2kljvm1qyo.sel4.cloudtype.app//Login.html");
    }
?>