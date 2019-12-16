## Sistemas de Multimídia
### Engenharia de Telecomunicações
> Repositório destinado para o projeto final da disciplina de SMU29009

#### Cenário geral

Há um servidor WebRTC cuja função é estabelecer conferência entre duas ou mais partes através de uma seção pré estabelecida.
O princípio de execução desde projeto foi baseado na implementação realizada pelo EasyRTC. Os tipos de mídia oferecidas nessa aplicação são:
* Áudio;
* Vídeo;
##### **Cenário de análise**

#### Partes envolvidas:
**Usuário 1**: Desktop com acesso a internet **IP**:191.36.15.45

**Usuário 2**: Celular utilizando WIFI **IP**: 191.36.10.22

**Navegador utilizado**: Google Chrome

#### Conteúdo de análise:

Será analisado neste cenário, uma comunicação multimídia entre **usuário 1** e **usuário 2**.  

#### Sinalização do WebRTC

| Data |
|---|
| → 2probe | 
| ← 3probe | 
| → 421["easyrtcCmd",{"msgType":"stillAlive","msgData":{}}] | 
| ← 431[{"msgType":"ack"}] |
| → 422["easyrtcCmd",{"msgType":"setRoomApiField","msgData":{"setRoomApiField":{"roomName":"default","field":{"mediaIds":{"fieldName":"mediaIds","fieldValue":{}}}}}}] |
| ← 432[{"msgType":"roomData","msgData":{"roomData":{"default":{"roomName":"default","roomStatus":"update","clientListDelta":{"updateClient":{"TxA1sCpvXBsJNJ3J":{"easyrtcid":"TxA1sCpvXBsJNJ3J","roomJoinTime":1574791029318,"presence":{"show":"chat","status":null},"apiField":{"mediaIds":{"fieldName":"mediaIds","fieldValue":{}}}}}}}}}}] |
| → 423["easyrtcCmd",{"msgType":"stillAlive","msgData":{}}] |
| ← 433[{"msgType":"ack"}] |
| → 2 |
| ← 3 |
| → 424["easyrtcCmd",{"msgType":"stillAlive","msgData":{}}] |
| ← 434[{"msgType":"ack"}] |
| → 2 |
| ← 3 |
| ··· |


Analisando a sequência de mensagens acima, verifica-se que, primeiramente, uma das partes faz um teste a fim de verificar a presença da outra, requisitando uma mensgem ("msgType") "stillAlive". Em seguida, o cliente responde com o "msgType" "ack", confirmando que está presente. 
Confirmada a presença, outra mensagem "msgType" é enviada, desta vez contendo o atributo "setRoomApiField". É requisitado com o campo "msgData". Este, solicita os dados especificados em seguida: "setRoomApiField", contendo "roomName" do tipo "default". 
Outro campo ("field") é especificado "mediaIds" contendo os campos "fieldName" com atributo "mediaIds" e "fieldValue". O atributo "mediaIds" retorna a identificação das mídias trocadas para início da troca das mesmas. O campo "easyrtcid" traz  a identificação da sessão.
Após o estabelecimento, ocorrem, repetidamente em curtos intervalos, testes de presença.

O parâmetro **easyrtcCmd** é utilizado pelo socket.io para enviar e receber os comandos de sinalização. 
Do lado do servidor, a menos que seja especificado, as mensagens enviadas retornarão com **ack** ou mensagem de **error**.
Há o **msgType**, que são os tipos de mensagens enviadas entre os clientes e que contém os parâmetros requisitados por cada cliente.
Há também o **msgData**, que contém as informações solicitadas pelo **msgType**.

Inicialmente, temos o *msgType* do tipo **candidate**. É uma sinalização do WebRTC. Ele envia os canditatos de ICE para o estabelecimento da conexão. Tanto a origem, quanto o destino, devem estar *online*, autenticados e na mesma sessão. Os campos deste tipo de mensagem são: *targetEasyrtcid* (exigido, pois é a identificação da sessão), e *msgData* (exigido pois é o contéudo da resposta da mensagem).

Para iniciar o estabelecimento da conexão, utiliza-se o *msgType* *offer*, que contém os campos: *targetEasyrtcid*, que é o identificador único do destino e o *msgData* que contém o SDP do usuário que iniciou a comunicação. Caso tudo ocorra bem, é recebido um *ack* do destino. 
Em seguida, após o sucesso do passo anterior, é recebido um *msgType* *answer*, que contém o os campos: *targetEasyrtcid*, que é o identificador único do destino e o *msgData* que contém o SDP do usuário alvo da comunicação. Caso tudo ocorra bem, é recebido um *ack* do destino.

Neste ponto, ambas as partes sabem da capacidade uma da outra em relação aos codecs de áudio e vídeo.

Caso o par rejeite a solicitação, o destino envia o **msgType** **reject** para a origem. Nessa mensagem de sinalização, há o campo: **targetEasyrtcid**, que contem a identificação da origem.

Há também a mensagem de sinalização que encerra a conexão, o **hangup**. O campo necessário é **targetEasyrtcid** que contém a identificação do alvo.

Durante a negociação e após o estabalecimento da conexão, o **msgType** **getIceConfig** é utilizado para obter a configuração de ICE mais recente, especialmente em conexões longas. Isso permite atulizar a lista de sevidores STUN e TURN.


| 421                                                                                                                                                                                                                                                                                                                                       | 431                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [<br>  "easyrtcCmd",<br>  {<br>    "msgType": "stillAlive",<br>    "msgData": {}<br>  }<br>]                                                                                                                                                                                                                                              | [<br>  {<br>    "msgType": "ack"<br>  }<br>]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 422                                                                                                                                                                                                                                                                                                                                       | 432                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| [<br>  "easyrtcCmd",<br>  {<br>    "msgType": "setRoomApiField",<br>    "msgData": {<br>      "<tab> setRoomApiField": {<br>        "roomName": "default",<br>        "field": {<br>          "mediaIds": {<br>            "fieldName": "mediaIds",<br>            "fieldValue": {}<br>          }<br>        }<br>      }<br>    }<br>  }<br>] | [<br>  {<br>    "msgType": "roomData",<br>    "msgData": {<br>      "roomData": {<br>        "default": {<br>          "roomName": "default",<br>          "roomStatus": "update",<br>          "clientListDelta": {<br>            "updateClient": {<br>              "TxA1sCpvXBsJNJ3J": {<br>                "easyrtcid": "TxA1sCpvXBsJNJ3J",<br>                "roomJoinTime": 1574791029318,<br>                "presence": {<br>                  "show": "chat",<br>                  "status": null<br>                },<br>                "apiField": {<br>                  "mediaIds": {<br>                    "fieldName": "mediaIds",<br>                    "fieldValue": {}<br>                  }<br>                }<br>              }<br>            }<br>          }<br>        }<br>      }<br>    }<br>  }<br>] |
         

Na tabela acima esta destacada a etapa do estabelecimento da conexão entre as partes.

Abaixo segue o diagrama ilustrando todo o processo descrito acima:

![Diagram](Diagrama_SMU.dot.svg)

Digrama gerado através da linguagem DOT, segue abaxo o código:
```dot
digraph G {
	size="8,6!"
	labelloc=c fontsize=30
	label ="Diagrama Sinalização easyRTC"
	labelloc = t
	rankdir = "LR"
	packMode = "clust"
	fixedsize = true
	splines = true

	CANDIDATE -> OFFER 
	OFFER -> ANSWER 
  OFFER -> CANDIDATE [label = "ack"]
  ANSWER -> OFFER [label = "ack"]
  OFFER -> REJECT
  REJECT -> CANDIDATE [label = "ack"]

 
}
```

#### Cabeçalhos do WebRTC 

##### Requisição

```
GEThttps://ifsc.ga/socket.io/?EIO=3&transport=websocket&sid=4LwWoaLpG7VuhSGcAAAt
[HTTP/1.1 101 Switching Protocols 11ms]

Request URL:https://ifsc.ga/socket.io/?EIO=3&transport=websocket&sid=4LwWoaLpG7VuhSGcAAAt
Request method:GET
Remote address:191.36.8.34:443
Status code:
101
Version:HTTP/1.1
```
##### Resposta
```
Response headers (234 B)	
Raw headers
HTTP/1.1 101 Switching Protocols
Server: nginx/1.17.4
Date: Mon, 04 Nov 2019 18:41:01 GMT
Connection: upgrade
Upgrade: websocket
Sec-WebSocket-Accept: q4+f69RRQf+ghhG3MRga1anbxZ8=
Sec-WebSocket-Extensions: permessage-deflate
Request headers (530 B)	
Raw headers
Host: ifsc.ga
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:68.0) Gecko/20100101 Firefox/68.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Sec-WebSocket-Version: 13
Origin: https://ifsc.ga
Sec-WebSocket-Extensions: permessage-deflate
Sec-WebSocket-Key: DGN9/tSYn5fteJkcq/SiNA==
Connection: keep-alive, Upgrade
Cookie: io=4LwWoaLpG7VuhSGcAAAt
Pragma: no-cache
Cache-Control: no-cache
Upgrade: websocket
```

#### Análise no navegador
##### SDP (Protocolo de Descrição da Sessão) local (Resposta)
```
v=0
o=mozilla...THIS_IS_SDPARTA-71.0 318964658487024909 0 IN IP4 0.0.0.0
s=-
t=0 0
a=sendrecv
a=fingerprint:sha-256 C1:13:4A:76:73:6B:6A:82:DD:13:D0:62:48:DB:12:CD:BE:E1:F4:9C:A3:2F:1C:38:D4:56:EE:5F:23:CC:F4:2D
a=group:BUNDLE 0 1
a=ice-options:trickle
a=msid-semantic:WMS *
m=audio 49625 UDP/TLS/RTP/SAVPF 109 9 0 8 101
c=IN IP4 191.36.15.4
a=candidate:0 1 UDP 2122187007 191.36.15.4 35212 typ host
a=candidate:6 1 UDP 2122252543 172.17.0.1 49625 typ host
a=candidate:12 1 TCP 2105458943 191.36.15.4 9 typ host tcptype active
a=candidate:13 1 TCP 2105524479 172.17.0.1 9 typ host tcptype active
a=candidate:0 2 UDP 2122187006 191.36.15.4 38945 typ host
a=candidate:6 2 UDP 2122252542 172.17.0.1 56840 typ host
a=candidate:12 2 TCP 2105458942 191.36.15.4 9 typ host tcptype active
a=candidate:13 2 TCP 2105524478 172.17.0.1 9 typ host tcptype active
a=candidate:9 1 UDP 1686052351 191.36.15.4 49625 typ srflx raddr 172.17.0.1 rport 49625
a=candidate:9 2 UDP 1686052350 191.36.15.4 56840 typ srflx raddr 172.17.0.1 rport 56840
a=sendrecv
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level
a=extmap:2/recvonly urn:ietf:params:rtp-hdrext:csrc-audio-level
a=extmap:3 urn:ietf:params:rtp-hdrext:sdes:mid
a=fmtp:109 maxplaybackrate=48000;stereo=1;useinbandfec=1
a=fmtp:101 0-15
a=ice-pwd:5fd23586350ecb1d8ed28914114b6943
a=ice-ufrag:c7321b41
a=mid:0
a=msid:{3ba5b148-206f-4c1c-afc8-6f10a7e7f609} {6dc9ae20-2059-406b-9edd-6d98a4efb87e}
a=rtcp:56840 IN IP4 172.17.0.1
a=rtcp-mux
a=rtpmap:109 opus/48000/2
a=rtpmap:9 G722/8000/1
a=rtpmap:0 PCMU/8000
a=rtpmap:8 PCMA/8000
a=rtpmap:101 telephone-event/8000
a=setup:actpass
a=ssrc:2427354511 cname:{a7038705-9ea6-45dd-a083-1ec23e280e0b}
m=video 49625 UDP/TLS/RTP/SAVPF 120 121 126 97
c=IN IP4 191.36.15.4
a=candidate:0 1 UDP 2122187007 191.36.15.4 37546 typ host
a=candidate:6 1 UDP 2122252543 172.17.0.1 33842 typ host
a=candidate:12 1 TCP 2105458943 191.36.15.4 9 typ host tcptype active
a=candidate:13 1 TCP 2105524479 172.17.0.1 9 typ host tcptype active
a=candidate:0 2 UDP 2122187006 191.36.15.4 57314 typ host
a=candidate:6 2 UDP 2122252542 172.17.0.1 45017 typ host
a=candidate:12 2 TCP 2105458942 191.36.15.4 9 typ host tcptype active
a=candidate:13 2 TCP 2105524478 172.17.0.1 9 typ host tcptype active
a=sendrecv
a=extmap:3 urn:ietf:params:rtp-hdrext:sdes:mid
a=extmap:4 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time
a=extmap:5 urn:ietf:params:rtp-hdrext:toffset
a=extmap:6/recvonly http://www.webrtc.org/experiments/rtp-hdrext/playout-delay
a=fmtp:126 profile-level-id=42e01f;level-asymmetry-allowed=1;packetization-mode=1
a=fmtp:97 profile-level-id=42e01f;level-asymmetry-allowed=1
a=fmtp:120 max-fs=12288;max-fr=60
a=fmtp:121 max-fs=12288;max-fr=60
a=ice-pwd:5fd23586350ecb1d8ed28914114b6943
a=ice-ufrag:c7321b41
a=mid:1
a=msid:{3ba5b148-206f-4c1c-afc8-6f10a7e7f609} {c60af14f-2a57-45a6-9570-195d14a7fdab}
a=rtcp:45017 IN IP4 172.17.0.1
a=rtcp-fb:120 nack
a=rtcp-fb:120 nack pli
a=rtcp-fb:120 ccm fir
a=rtcp-fb:120 goog-remb
a=rtcp-fb:121 nack
a=rtcp-fb:121 nack pli
a=rtcp-fb:121 ccm fir
a=rtcp-fb:121 goog-remb
a=rtcp-fb:126 nack
a=rtcp-fb:126 nack pli
a=rtcp-fb:126 ccm fir
a=rtcp-fb:126 goog-remb
a=rtcp-fb:97 nack
a=rtcp-fb:97 nack pli
a=rtcp-fb:97 ccm fir
a=rtcp-fb:97 goog-remb
a=rtcp-mux
a=rtpmap:120 VP8/90000
a=rtpmap:121 VP9/90000
a=rtpmap:126 H264/90000
a=rtpmap:97 H264/90000
a=setup:actpass
a=ssrc:3577008086 cname:{a7038705-9ea6-45dd-a083-1ec23e280e0b}
```

##### Codec ofertados na resposta
**Vídeo:**

 - VP8 à 90000 Hz
 - VP9 à 90000 Hz
 - H264 à 90000 Hz
 
 **Áudio**
 
 - opus à 48000 Hz, com 2 canais
 - ISAC à 16000 Hz, com 1 canal
 - G722/à 8000 Hz, com 1 canal
 - PCMU à 8000 Hz
 - PCMA à 8000 Hz

##### SDP (Protocolo de Descrição da Sessão) Remoto (Oferta)
```
v=0
o=- 7858975486700602011 2 IN IP4 127.0.0.1
s=-
t=0 0
a=sendrecv
a=group:BUNDLE 0 1
a=msid-semantic:WMS 6CgZG4eSFUCv3SUbVWUWCBvQ8RtwIhD3WVhR
m=audio 9 UDP/TLS/RTP/SAVPF 109 9 0 8 101
c=IN IP4 0.0.0.0
a=candidate:1108098214 1 udp 2122262783 2804:1454:1004:530:94c4:f03a:11c6:d414 48895 typ host generation 0 ufrag jjG4 network-id 2 network-cost 10
a=candidate:2346220213 1 udp 2122194687 191.36.11.53 48612 typ host generation 0 ufrag jjG4 network-id 1 network-cost 10
a=sendrecv
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level
a=extmap:3 urn:ietf:params:rtp-hdrext:sdes:mid
a=fingerprint:sha-256 50:C2:27:D2:9D:BD:5B:83:A6:F4:79:11:20:CD:BC:8F:12:C7:EC:93:2D:7C:75:DB:00:88:29:7E:DD:AF:67:A2
a=fmtp:109 maxplaybackrate=0;stereo=0;useinbandfec=1
a=ice-options:trickle
a=ice-pwd:fAicE/AhqYBIOuqH2a0+sD6B
a=ice-ufrag:jjG4
a=mid:0
a=msid:6CgZG4eSFUCv3SUbVWUWCBvQ8RtwIhD3WVhR 4518f415-3d00-4a47-ba0a-aeaf47ae7ec3
a=rtcp:9 IN IP4 0.0.0.0
a=rtcp-mux
a=rtpmap:109 opus/48000/2
a=rtpmap:9 G722/8000/1
a=rtpmap:0 PCMU/8000
a=rtpmap:8 PCMA/8000
a=rtpmap:101 telephone-event/8000
a=setup:active
a=ssrc:3981974271 cname:N/AtXI3n9FOpW9an
m=video 9 UDP/TLS/RTP/SAVPF 120 121 126
c=IN IP4 0.0.0.0
a=sendrecv
a=extmap:5 urn:ietf:params:rtp-hdrext:toffset
a=extmap:4 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time
a=extmap:6 http://www.webrtc.org/experiments/rtp-hdrext/playout-delay
a=extmap:3 urn:ietf:params:rtp-hdrext:sdes:mid
a=fingerprint:sha-256 50:C2:27:D2:9D:BD:5B:83:A6:F4:79:11:20:CD:BC:8F:12:C7:EC:93:2D:7C:75:DB:00:88:29:7E:DD:AF:67:A2
a=fmtp:126 profile-level-id=42e01f;level-asymmetry-allowed=1;packetization-mode=1
a=ice-options:trickle
a=ice-pwd:fAicE/AhqYBIOuqH2a0+sD6B
a=ice-ufrag:jjG4
a=mid:1
a=msid:6CgZG4eSFUCv3SUbVWUWCBvQ8RtwIhD3WVhR 8decff6c-d9b4-427c-acea-ed7f55a615b7
a=rtcp:9 IN IP4 0.0.0.0
a=rtcp-fb:120 goog-remb
a=rtcp-fb:120 ccm fir
a=rtcp-fb:120 nack
a=rtcp-fb:120 nack pli
a=rtcp-fb:121 goog-remb
a=rtcp-fb:121 ccm fir
a=rtcp-fb:121 nack
a=rtcp-fb:121 nack pli
a=rtcp-fb:126 goog-remb
a=rtcp-fb:126 ccm fir
a=rtcp-fb:126 nack
a=rtcp-fb:126 nack pli
a=rtcp-mux
a=rtpmap:120 VP8/90000
a=rtpmap:121 VP9/90000
a=rtpmap:126 H264/90000
a=setup:active
a=ssrc:4074892717 cname:N/AtXI3n9FOpW9an
```

##### Codec ofertados na Oferta

**Vídeo:**

 - VP8 à 90000 Hz
 - VP9 à 90000 Hz
 - H264 à 90000 Hz
 
 **Áudio:**
 
 - opus à 48000 Hz, com 2 canais
 - ISAC à 16000 Hz, com 1 canal
 - G722 à 8000 Hz,a=rtpmap:120 VP8/90000

a=rtpmap:121 VP9/90000

a=rtpmap:126 H264/90000
 com 1 canal
 - PCMU à 8000 Hz
 - PCMA à 8000 Hz


#### Exemplo de comunicação observado através do about:config do Firefox


|Candidato local |	Candidato remoto |	ID do componente |	Estado ICE |	Prioridade |	Nomeado |	Selecionado |	Bytes enviados |	Bytes recebidos |
|---|---|---|---|---|---|---|---|---|
|191.36.15.49:51149/a=rtpmap:120 VP8/90000

a=rtpmap:121 VP9/90000

a=rtpmap:126 H264/90000
udp(host) [non-proxied] |	191.36.10.110:41725/udp(host) |	1	|succeeded |	9114723795305512000 |	true |	true |	84102 |	195032 |
|10.10.10.113:37057/udp(host) [non-proxied] |	191.36.10.110:41725/udp(host) |	1 |	failed |	9114756780654461000 |	false |	false |	0 |	0 |
|(redacted):37057/udp(prflx) [non-proxied] |	191.36.10.110:41725/udp(host) |	1	| succeeded |	7962083765675376000 |	false |	false |	0 |	0 |
