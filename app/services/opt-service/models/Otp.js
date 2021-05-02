
global.finalResponseCode = undefined;


module.exports = class Otp {
    constructor(databaseHandler, triesNumber, expiredAfter) {
        this.table = 'otp';
        this.connection = databaseHandler
        this.tries = triesNumber
        this.expiredAfter = expiredAfter
    }

    setMobilePhone(mobilePhone) {
        this.phone = mobilePhone
    }


    // generate code and save it in db and send to user in sms
    // input mobile number
    code() {

        this.connection.query('SELECT * FROM ' + this.table + ' WHERE phone = ? ', [this.phone], (error, results, fields) => {
            if (error) { // try again
                console.log(error)
                global.finalResponseCode = 100;
                return;
            } else {

                if (results.length > 0) { // user exists in otp table

                    if (this.allowedToGenerateNewCode(results[0])) {

                        // increment the tries number one step (+1)


                        let phoneNumber = this.phone

                        let code = this.generateCode()

                        let values = { otp_code: code, tries: results[0].tries + 1, send_at: (new Date()).getTime() }

                        this.connection.on('enqueue',  (connection) => {
                            connection.query('UPDATE ' + this.table + ' SET ? WHERE phone = ?', [values, phoneNumber], (error, result, fields) => {
                                if (error) { // try again

                                    global.finalResponseCode = 100
                                    return;
                                } else {
                                    global.finalResponseCode = 200 // code sent successfully
                                    return;
                                }
                            })
                        })





                    } else {
                        // not allowed to regenerate in current day try after 24 hours
                        global.finalResponseCode = 300
                        return;
                    }
                } else {


                    // create new record
                    let phoneNumber = this.phone

                    let code = this.generateCode()

                    let values = { otp_code: code, phone: phoneNumber, tries: 1, send_at: (new Date()).getTime() }

                    this.connection.on('enqueue',  (connection) => {
                        connection.query('INSERT INTO ' + this.table + ' SET ?', values, (error, result, fields) => {
                            if (error) { // try again
                                global.finalResponseCode = 100
                                return;
                            }else{

                                global.finalResponseCode = 200 // code sent successfully
                                console.log(global.finalResponseCode)
                                return;
                            }

                        })
                    })


                }

            }
            


        });

        return global.finalResponseCode
    }


    // verify if the saved code equal the code in the request body
    // input code 
        verify() {

    }

    allowedToGenerateNewCode(record) {

        let lastMessageSentAt = record.send_at

        let currentTime = (new Date()).getTime()

        let h24 = 60 * 60 * 24
        // 1619910 593225
        // 1619910 913510  320285
        // 86400

        if (((currentTime - lastMessageSentAt) / 1000) < h24) { // try to access at the same day

            if (record.tries + 1 <= this.tries) { // not exceeded the tries limit => allowed

                return true

            } else {
                // at the same day and completed the all available triess => not allowed (X)
                return false
            }

        } else {
            // reset the tries to zero => allowed
            this.connection.on('enqueue',  (connection) => {
                connection.query('UPDATE ' + this.table + 'SET tries = ? WHERE phone = ?', [0, this.phone], (error, result, fields) => {
                    if (error)
                        return false

                    return true
                })
            });


        }
    }



    generateCode() {

        // return '55555'

        return '' +
            Math.floor(Math.random() * 10) +
            Math.floor(Math.random() * 10) +
            Math.floor(Math.random() * 10) +
            Math.floor(Math.random() * 10) +
            Math.floor(Math.random() * 10)

    }

}






