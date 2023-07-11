<html>
    <head>
        <title>Flier</title>
        <link rel="stylesheet" href="CSS/style.css">
        <link rel="stylesheet" href="CSS/font.css">
        <script src="JavaScript/FormCheck.js"></script>
        <meta charset="utf-8">
    </head>
    <body id="Main_BackGround" onload="InitForm();">
        <div>
            <form action="SignUp.php" method="POST">
                <div>
                    <input id="id" type="text" name="id" placeholder="아이디" oninput="Input_Check(this);">
                </div>
                <div>
                    <input id="pw" type="password" name="pw" placeholder="비밀번호" oninput="Input_Check(this);">
                </div>
                <div>
                    <input id="confirm_pw" type="password" name="confirm_pw" placeholder="비밀번호 확인" oninput="Input_Check(this);">
                </div>
                <div>
                    <input id="nick_name" type="text" name="nick_name" placeholder="별명" oninput="Input_Check(this);">
                </div>
                <div id="MainMenuBox">
                    <a href="Login.html">로그인 페이지로 이동</a>
                    <button id="sign_up" type="submit" disabled>회원가입</button>
                </div>
            </form>
        </div>
    </body>
</html>
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
    $result = DuplicateCheck($id);
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