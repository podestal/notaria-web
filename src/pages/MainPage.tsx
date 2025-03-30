import Header from '../router/Header'

const MainPage = () => {
  return (
    <>
    {/* <table width={950} style={{ height: 134 }} border={0} cellSpacing={0} cellPadding={0}>
      <tr>
        <td style={{ position: 'relative', left: '17%' }} height="134"><img src={headerImg} width="727" height="133" /></td>
        <td style={{ position: 'relative', left: '17%' }} width="4" align="center">&nbsp;</td>
        <td style={{ position: 'relative', left: '17%', backgroundImage: 'url(iconos/menuicon.png)' }} width="217" valign="bottom"><table width="216" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td width="182" height="28" align="right"><span className="usuario"><em>Usuario</em></span></td>
            <td width="34" height="32" align="center"><img src="iconos/usuario.png" width="27" height="27" /></td>
          </tr>
          <tr>
            <td height="28" align="right"><a href="pass.php" className="menu Estilo3" target="principal"><em>Cambiar Contraseña</em></a></td>
            <td height="26" align="center"><img src="iconos/llave.png" width="23" height="23" /></td>
          </tr>
          
          <tr>
            <td height="14" align="right"><a href="salir.php" className="menu"><em>Cerrar Sesión</em></a></td>
            <td height="6" align="center"><img src="iconos/salir.png" width="23" height="23" /></td>
          </tr>
          <tr>
            <td height="14" align="right">&nbsp;</td>
            <td height="5" align="center">&nbsp;</td>
          </tr>
        </table></td>
      </tr>
      <div style={{ position: 'absolute', top: '20px', left: '10px' }}>
        <img src={notariaLogo} alt="" style={{ width: '280px' }} />
    </div>
    </table> */}
    <Header />
    </>
  )
}

export default MainPage