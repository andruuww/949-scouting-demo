$(document).ready(() => {
    const qrcode = new QRCode("data", {
        text: "TEAM949",
        width: 256, 
        height: 256,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    $("#output").hide();

    $("form").on('submit', (e) => {
        // code was behaving asynchronously? created problems
        processData();
        e.preventDefault();
    });

    function generateCode(data) {
        return new Promise((resolve, reject) => {
            qrcode.makeCode(data);
            resolve();
        })
    }

    async function processData() {
        qrcode.clear();
        $("#output").show();
    
        let data = "";
        const teamNumber = $("form :input[id=teamNumber]").val();

        $("form :input").each((i, element) => {
            if (element.type == "submit") {
                // skip the button
                return true;
            }
            data += element.value.toLowerCase() + ",";
        });
        
        await generateCode(data);

        $("#team-label").html(`FRC# ${teamNumber}`);        
        // downloading the resulting qr code and meta label
        html2canvas(document.getElementById("output")).then((canvas) => {
            // IE/Edge Support... idk if this actually works but let's just say it works
            if (window.navigator.msSaveBlob) {
                window.navigator.msSaveBlob(canvas.msToBlob(), `Pitscouting FRC#${teamNumber}.png`);
            } else {
                const a = document.createElement("a");

                document.body.appendChild(a);
                a.href = canvas.toDataURL();
                a.download = `Pitscouting FRC#${teamNumber}.png`;
                a.click();
                document.body.removeChild(a);
            }
        });

        $("#output").hide();
    }
});

