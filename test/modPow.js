'use strict';

// For the browser test builder to work you MUST import them module in a variable that
// is the camelised version of the package name.
const bigintCryptoUtils = require('../dist/bigint-crypto-utils-latest.node');
const chai = require('chai');

const inputs = [
    {
        g: BigInt(4),
        e: BigInt(-1),
        m: BigInt(19),
        modPow: BigInt(5)
    },
    {
        g: BigInt(-5),
        e: BigInt(2),
        m: BigInt(7),
        modPow: BigInt(4)
    },
    {
        g: BigInt(2),
        e: BigInt(255),
        m: BigInt(64),
        modPow: BigInt(0)
    },
    {
        g: BigInt(3),
        e: BigInt(3),
        m: BigInt(25),
        modPow: BigInt(2)
    },
    {
        g: BigInt('2'),
        e: BigInt('10'),
        m: BigInt('1023'),
        modPow: BigInt('1')
    },
    {
        g: BigInt('2'),
        e: BigInt('128'),
        m: BigInt('340282366920938463463374607431768211455'),
        modPow: BigInt('1')
    },
    {
        g: BigInt('18'),
        e: BigInt('200'),
        m: BigInt('113370750249550604745292091968145836496593222544915456254424294090214656803829265088806897860919390278691594885690704522965220688091605288814511793200647764531655156263734134814096833745360631878996550663492553415503844632080541534071778400366940389371'),
        modPow: BigInt('5')
    },
    {
        g: BigInt('452149997592306202232720864363485824701879487303880767747217308770351197801836846325633986474037061753983278534192061455638289551714281047915315943771002615269860312318606105460307037327329178890486613832051027105330475852552183444938408408863970975090778239473049899109989825645608770309107015209564444316'),
        e: BigInt('313632271690673451924314047671460131678794095260951233878123501752357966284491455239133687519908410656818506813151659324961829045286402303082891913186909806785080978448037486178337722667190743610785429936585699831407575170854873682955317589189564880931807976657385223632835801016017549762825562427694700595'),
        m: BigInt('503920301461718841589267304263845359224454055603847417021399996422142529929535423886894599506329362009085557636432288745748144369296043048325513558512136442971686130986388589421125262751724362880217790112013162815676017250234401214198365302142787009943498370856167174244675719638815809347261773472114842037'),
        modPow: BigInt('116151033665657122493185787869806545202689299276386248795495327814334155060582848283813920809806733483932890630813383732570880648835941403266559981745292170093730444958664287150348638825646041123624934609342209607324573471488516182043623392135349935513599211751048985945264854946690735102886684991537356085')
    },
    {
        g: BigInt('11841935024364147716353320299341739746172519891965671690856511761865081119900229173686108717306066896171532380925613022558468135419569531408705599582485574759090606783343741354786730145579374943152051295610903329485954362785549544146607372955327416350026611939729169427564923964331600602513490664280385400363896503502618765510767404081687040998331391413380992872139563001129973563785491932737613134937848408559444512754094028193888934364360751954963910053047084765967986440762176806250300224273006224896155131567757418573065406225474586114429703299114459699487144564058284097113758170076484715508822046276851937344229994032299074549882379678277342210908690759551148001807924384828911534562173037482679758571511882241324466037988240844278798626364844736890608256926987106577360912025740735500279259884719582317874795989021225051547012005127160387041195943076115874004566418428286364513525338678717276611964848702181954630512848191062142396301410082041125076883572620522585524189957008997152113326270905908574824930439364294142561506869607441990637434011705058731047210767842283095833998881458174313018987516885015966730190851246509145996081186244452977612840231233975504254511906873635067423284474418010779'),
        e: BigInt(65537),
        m: BigInt('664696945209992458756686149346245451959976517638292928791700179256844281858185896099125067951952654402490086135552162143078899299811359837084271751151028163085460532259189536386314535196930287132524181089869416574933585854601187369425268075047954322131181886825614483567135422315378239368406529687890501058842464349082654178783249154514852387342368449159786841244102661841103091274080943628377889327373287942549931933940344234893839788400814498566635472921769540354411299285799802711867703483574544771980813294079644617078375407600316797552977237711658136574314463163234925711424649561555664033424194956707145914242094743912526316349196624502213586536538135869789635707369927717355832447046508211207481639911848541479454441364007603812247204467303083508820904250883393507217714190069793899396969055025331820102813163487922147786603563622819501665346051997106311026362529468828905149816662831114932006157324643497015674078299348822374197702985903910072842251175854608734890112310948483203483961426536448185519679528107211468599094104146030976001545010516921072850544164805486025720876961534563519564195975619474559646887965720356652237259589839928212094478013164459912910325366814653885115295888383834706100540709594519005127572401811'),
        modPow: BigInt('161536302965876859810326974717696098103400028325290400098009372420705842141606061937868139599254889552827198179700943830904638623242340901324168739379683610826318364033114567151761440476743429035585669319987243392873067886301931060535626608607104747706524265295724084154614882717640324951625739784886033546192235102457885887408101631405915966581111883511865128039796236163741845154646134946752753268709040854209729956504178887533788747747119724211698890580997678823386819800221402603296179505514972437060254830220689683909538655135024950098209110995272202278241518477093098370353714764725812198054783679272603305985540377409944139710135412033750841657291714011251536147009157592696923268320898824641942748639453777599991450459711759300887988978324145615092849769787050388971709612414990408313473964177698898938543373681132731816503192893237346062747275578792432555393605002601917267269068710962123252254945878806405012635482349703526986160866564599536586917650117294496046786249510075244065039160250373641752532225496475389831533373840552676329192759279134395710908869089593417334022492165553094734796332770913945001202427237115943860676216249286700909563116282282221663391416906533276082395469933511482736965528809555212759373890794')
    }
];

describe('modPow', function () {
    const ITERATIONS = 100;
    const CSVFILE = 'modPow.csv';

    if (!process.browser) {
        const csvRow = 'g,e,m,exp. method,iterations,total time,median time\n';
        require('fs').writeFileSync(CSVFILE, csvRow);
    }
    for (const input of inputs) {
        const method1 = 'Left-to-right binary';
        describe(`${method1}. ${ITERATIONS} iterations. modPow(${input.g}, ${input.e}, ${input.m})`, function () {
            it(`should return ${input.modPow}`, function () {
                let time = [];
                for (let i = 0; i < ITERATIONS; i++) {
                    let start, end;
                    if (!process.browser) start = process.hrtime.bigint();
                    const ret = bigintCryptoUtils.modPow(input.g, input.e, input.m, 0);
                    if (!process.browser) end = process.hrtime.bigint();
                    if (!process.browser) time[i] = (end - start);
                    chai.expect(ret.toString()).equals(input.modPow.toString());
                }
                if (!process.browser) {
                    const csvRow = `'${input.g}','${input.e}','${input.m}','${method1}',${ITERATIONS},${_sum(time)},${_median(time)}\n`;
                    require('fs').appendFileSync(CSVFILE, csvRow);
                }
            });
        });
        const method2 = 'Right-to-left binary';
        describe(`${method2}. ${ITERATIONS} iterations. modPow(${input.g}, ${input.e}, ${input.m})`, function () {
            it(`should return ${input.modPow}`, function () {
                let time = [];
                for (let i = 0; i < ITERATIONS; i++) {
                    let start, end;
                    if (!process.browser) start = process.hrtime.bigint();
                    const ret = bigintCryptoUtils.modPow(input.g, input.e, input.m, 1);
                    if (!process.browser) end = process.hrtime.bigint();
                    if (!process.browser) time[i] = (end - start);
                    chai.expect(ret.toString()).equals(input.modPow.toString());
                }
                if (!process.browser) {
                    const csvRow = `'${input.g}','${input.e}','${input.m}','${method2}',${ITERATIONS},${_sum(time)},${_median(time)}\n`;
                    require('fs').appendFileSync(CSVFILE, csvRow);
                }
            });
        });

        const bitOfK = [1, 2, 3, 4, 5, 6, 7, 8];
        const gPowers = [];
        const method3 = [];
        for (let j = 0; j < bitOfK.length; j++) {
            const baseBits = bitOfK[j];
            const base = BigInt(2) ** BigInt(baseBits);
            gPowers[j] = new Array(base);
            gPowers[j][0] = BigInt(1);
            gPowers[j][1] = input.g;
            for (let k = 2; k < base; k++) {
                gPowers[j][k] = (gPowers[j][k - 1] * input.g) % input.m;
            }
            method3[j] = `Left-to-right ${base}-ary`;
            describe(`${method3[j]}. ${ITERATIONS} iterations. modPow(${input.g}, ${input.e}, ${input.m})`, function () {
                it(`should return ${input.modPow}`, function () {
                    let time = [];
                    for (let i = 0; i < ITERATIONS; i++) {
                        let start, end;
                        if (!process.browser) start = process.hrtime.bigint();
                        const ret = bigintCryptoUtils.modPow(input.g, input.e, input.m, 2, baseBits);
                        if (!process.browser) end = process.hrtime.bigint();
                        if (!process.browser) time[i] = (end - start);
                        chai.expect(ret.toString()).equals(input.modPow.toString());
                    }
                    if (!process.browser) {
                        const csvRow = `'${input.g}','${input.e}','${input.m}','${method3[j]}',${ITERATIONS},${_sum(time)},${_median(time)}\n`;
                        require('fs').appendFileSync(CSVFILE, csvRow);
                    }
                });
            });
            describe(`${method3[j]}. Precomputed powers of g. ${ITERATIONS} iterations. modPow(${input.g}, ${input.e}, ${input.m})`, function () {
                it(`should return ${input.modPow}`, function () {
                    let time = [];
                    for (let i = 0; i < ITERATIONS; i++) {
                        let start, end;
                        if (!process.browser) start = process.hrtime.bigint();
                        const ret = bigintCryptoUtils.modPow(input.g, input.e, input.m, 2, baseBits, gPowers[j]);
                        if (!process.browser) end = process.hrtime.bigint();
                        if (!process.browser) time[i] = (end - start);
                        chai.expect(ret.toString()).equals(input.modPow.toString());
                    }
                    if (!process.browser) {
                        const csvRow = `'${input.g}','${input.e}','${input.m}','${method3[j]}. Precomputed powers of g',${ITERATIONS},${_sum(time)},${_median(time)}\n`;
                        require('fs').appendFileSync(CSVFILE, csvRow);
                    }
                });
            });
        }

        const baseBitsArr = [128, 256, 512, 1024];
        if (input.m % BigInt(2) === BigInt(1)) {
            for (let i = 0; i < baseBitsArr.length; i++) {
                const baseBits = baseBitsArr[i];
                const method4 = `Left-to-right + MontMul. Base bits=${baseBits}`;
                describe(`${method4}. ${ITERATIONS} iterations. modPow(${input.g}, ${input.e}, ${input.m})`, function () {
                    it(`should return ${input.modPow}`, function () {
                        let time = [];
                        for (let i = 0; i < ITERATIONS; i++) {
                            let start, end;
                            if (!process.browser) start = process.hrtime.bigint();
                            const ret = bigintCryptoUtils.modPow(input.g, input.e, input.m, 3, baseBits);
                            if (!process.browser) end = process.hrtime.bigint();
                            if (!process.browser) time[i] = (end - start);
                            chai.expect(ret.toString()).equals(input.modPow.toString());
                        }
                        if (!process.browser) {
                            const csvRow = `'${input.g}','${input.e}','${input.m}','${method4}',${ITERATIONS},${_sum(time)},${_median(time)}\n`;
                            require('fs').appendFileSync(CSVFILE, csvRow);
                        }
                    });
                });
                const method5 = `Right-to-left + MontMul. Base bits=${baseBits}`;
                describe(`${method5}. ${ITERATIONS} iterations. modPow(${input.g}, ${input.e}, ${input.m})`, function () {
                    it(`should return ${input.modPow}`, function () {
                        let time = [];
                        for (let i = 0; i < ITERATIONS; i++) {
                            let start, end;
                            if (!process.browser) start = process.hrtime.bigint();
                            const ret = bigintCryptoUtils.modPow(input.g, input.e, input.m, 4, baseBits);
                            if (!process.browser) end = process.hrtime.bigint();
                            if (!process.browser) time[i] = (end - start);
                            chai.expect(ret.toString()).equals(input.modPow.toString());
                        }
                        if (!process.browser) {
                            const csvRow = `'${input.g}','${input.e}','${input.m}','${method5}',${ITERATIONS},${_sum(time)},${_median(time)}\n`;
                            require('fs').appendFileSync(CSVFILE, csvRow);
                        }
                    });
                });
            }
            const method6 = 'Left-to-right + Redc.';
            describe(`${method6}. ${ITERATIONS} iterations. modPow(${input.g}, ${input.e}, ${input.m})`, function () {
                it(`should return ${input.modPow}`, function () {
                    let time = [];
                    for (let i = 0; i < ITERATIONS; i++) {
                        let start, end;
                        if (!process.browser) start = process.hrtime.bigint();
                        const ret = bigintCryptoUtils.modPow(input.g, input.e, input.m, 5);
                        if (!process.browser) end = process.hrtime.bigint();
                        if (!process.browser) time[i] = (end - start);
                        chai.expect(ret.toString()).equals(input.modPow.toString());
                    }
                    if (!process.browser) {
                        const csvRow = `'${input.g}','${input.e}','${input.m}','${method6}',${ITERATIONS},${_sum(time)},${_median(time)}\n`;
                        require('fs').appendFileSync(CSVFILE, csvRow);
                    }
                });
            });
            const method7 = 'Right-to-left + Redc.';
            describe(`${method7}. ${ITERATIONS} iterations. modPow(${input.g}, ${input.e}, ${input.m})`, function () {
                it(`should return ${input.modPow}`, function () {
                    let time = [];
                    for (let i = 0; i < ITERATIONS; i++) {
                        let start, end;
                        if (!process.browser) start = process.hrtime.bigint();
                        const ret = bigintCryptoUtils.modPow(input.g, input.e, input.m, 6);
                        if (!process.browser) end = process.hrtime.bigint();
                        if (!process.browser) time[i] = (end - start);
                        chai.expect(ret.toString()).equals(input.modPow.toString());
                    }
                    if (!process.browser) {
                        const csvRow = `'${input.g}','${input.e}','${input.m}','${method7}',${ITERATIONS},${_sum(time)},${_median(time)}\n`;
                        require('fs').appendFileSync(CSVFILE, csvRow);
                    }
                });
            });
        }
    }
});

function _sum(arr) {
    return arr.reduce((previous, current) => current += previous);
}

function _median(arr) {
    arr.sort((a, b) => a - b);
    return (arr[(arr.length - 1) >> 1] + arr[arr.length >> 1]) / BigInt(2);
}