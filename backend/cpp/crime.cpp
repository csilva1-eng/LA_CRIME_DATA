
#include "tree.h"

int main(int argc, char* argv[]) {
    //argv[1] holds the search argument, argv[0] gives ur directory for some reason im not sure why. maybe how nodejs works
    CrimeTree tree;
    tree.grabJsonData();
    string searchAlg = argv[1];
    if (searchAlg == "bfs") {
        tree.bfsAlg();
    } else if (searchAlg == "dfs") {
        tree.dfsAlg();
    } else {
        cout << "Invalid search type. Error in main file for crime";
    }


}
