<?php
	header("Content-type: text/html; charset=UTF-8");

    //接收get请求的参数
	$flag = $_GET['flag'];
	$param = urlencode(urldecode($_GET['param']));
    //判断
	switch ($flag)
    {
    case 1:
      $url='http://www.weather.com.cn/data/sk/'.$param.'.html';
      break;
    case 2:
      $url='http://www.096.me/api.php?phone='.$param.'&mode=txt';
      break;
    case 3:
    $url='http://www.kuaidi100.com/chaxun?com=[]&nu=[]';

      break;
    case 4:
      $url= 'http://fanyi.youdao.com/openapi.do?keyfrom=devisservice&key=1240840662&type=data&doctype=json&version=1.1&q='.$param;
      break;
    default:
        break;
    }

    //发送get请求
    try{
      $html = file_get_contents($url);
    }catch(Exception $e){
      //返回数据
      echo urlencode("数据获取失败，请重新获取！");
    }

    if($html == ""){
      $html = "数据获取失败，请重新获取！";
    }
    //返回数据
    echo urlencode($html);
?>