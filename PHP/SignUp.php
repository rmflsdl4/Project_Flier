<?php
    include_once('DB_Connect.php');

    if(isset($_POST['id'], $_POST['pw'], $_POST['confirm_pw'], $_POST['nick_name'])){
        $id = $_POST['id'];
        $pw = $_POST['pw'];
        $confirm_pw = $_POST['confirm_pw'];
        $nick_name = $_POST['nick_name'];

        $query = "INSERT INTO users(id, pw, nick_nme) VALUES (?, ? ,?)";

        $stmt = mysqli_prepare($conn, $query);
        
        mysqli_stmt_bind_param($stmt, 'sss', $id, $pw, $nick_name);

        $result = mysqli_stmt_excute($stmt);

        if (mysqli_affected_rows($conn) > 0) {
            echo '데이터가 성공적으로 삽입되었습니다.';
        }

        mysqli_stmt_close($stmt);
        mysqli_close($conn);
    }
?>