#include "openfhe.h"
#include <iostream>

using namespace lbcrypto;

int main() {
    
    auto cc = CryptoContextFactory<DCRTPoly>::genCryptoContextBFVrns(2048, HEStd_128_classic, 256, 65537);

    
    cc->Enable(ENCRYPTION);
    cc->Enable(SHE);

    
    auto keyPair = cc->KeyGen();
    cc->EvalMultKeyGen(keyPair.secretKey);

    
    Plaintext plaintext1 = cc->MakePackedPlaintext({5});
    Plaintext plaintext2 = cc->MakePackedPlaintext({10});
    auto ciphertext1 = cc->Encrypt(keyPair.publicKey, plaintext1);
    auto ciphertext2 = cc->Encrypt(keyPair.publicKey, plaintext2);

    
    auto ciphertextAdd = cc->EvalAdd(ciphertext1, ciphertext2);

    
    auto ciphertextMul = cc->EvalMult(ciphertext1, ciphertext2);

    
    Plaintext resultAdd, resultMul;
    cc->Decrypt(keyPair.secretKey, ciphertextAdd, &resultAdd);
    cc->Decrypt(keyPair.secretKey, ciphertextMul, &resultMul);

    std::cout << "Résultat de l'addition : " << resultAdd << std::endl;
    std::cout << "Résultat de la multiplication : " << resultMul << std::endl;

    return 0;
}
