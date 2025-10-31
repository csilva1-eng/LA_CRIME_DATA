//
// Created by Christopher Silva on 10/26/25.
//
#include "tree.h"
#include <bits/stdc++.h>
//https://gist.github.com/Einstrasse/ac0fe7d7450621a39364ed3b05cacd11 use this and put it into that directory
#include "json.hpp" // include nlohmann json library
using json = nlohmann::json; //Just for json abbreviation
using namespace std;

/*
i want the root to have a growing vector of other nodes
no other nodes will have this vector

 */

/*
 *bfs alg is self explanatory
 *nodes have a string for dr_num which is a unique value provided by dataset
 *string for val which would be any of the values. I think i wanted it to have a third value but i cant remember what
 *
 *roots are held in a map of string and nodes. string would hold the val so no two subtrees hold the same val
 *nodes would be the roots for the subtrees
 *
 *nodes have a left right
 *
 *not sure what insert record is but ill leave that in case someone wants to work  on it
 *
 *insert node checks if the val is already in the map. if not then it puts val in map and gives the inserted node as its root
 *if val found then itll insert it into the subtree using insertInSubtree
 *insertInSubtree is just recursive LNR order of trying to insert
 *
 *greater string is for us to find difference between dr numbers for organization in tree. the data set gives dr num as a
 *string for whatever reason so i tried my best to do the fastest way to find which is greater
 */

struct Node {
    unordered_map<std::string, Node*> children;
    //int count; //For records
    Node* right = nullptr;
    Node* left = nullptr;
    string dr_num;
    string val;
    Node(string& dr_num, string& val) {
        this->dr_num = dr_num;
        this->val = val;
        count = 0;
        right = nullptr;
        left = nullptr;
    } 
};

class CrimeTree {
    map<string, Node*> roots;

public:
//    Node* root = new Node("root");

    void insertRecord(const json &record) {
        string area = record.value("area_name", "Unknown");
        string type = record.value("crime_type", "Unknown");
        string year = record.value("year", "Unknown");

        Node* areaNode = get(root, area);
        Node* typeNode = get(areaNode, type);
        Node* yearNode = get(typeNode, year);

        //Should incrememtn count at each level
        yearNode->count += 1;
        typeNode->count += 1;
        areaNode->count += 1;
    }

    void insertNode(string dr_num, string val){
        if (roots.find(val) == roots.end()) {
            roots[val] = new Node(dr_num, val);
            return;
        }
        Node* node = new Node(dr_num, val);
        roots[val] = insertInSubtree(node, roots[val]);
      }

    bool greaterString(const string &str1, const string &str2) {
        for (int i =0 ; i < str1.size(); i++) {
            if (str1[i] - '0' > str2[i] - '0') return true;
        }
        return false;
    }

    Node* insertInSubtree(Node* node, Node* root) {
        //LNR recursive form of insert
        if (!root) return nullptr;

        if (greaterString(root->dr_num, node->dr_num)) { //change these to functions
            root->left = insertInSubtree(node, root->left);
        }
        if (greaterString(node->dr_num, root->dr_num)) {
            root->right = insertInSubtree(node, root->right);
        }

        return root;
    }

    //now implement bfs and dfs
    void bfsAlg() {
        queue<Node*> q;
        auto itr = roots.begin();
        while (itr != roots.end()) {
            q.push(itr->second);
            itr++;
        }

        if (q.front() == nullptr) q.pop();
        while (!q.empty()) {
            int len = q.size();

            for (int i = 0; i < len; i++) {

                Node *node = q.front();
                q.pop();

                cout << q.front()->dr_num << " " << q.front()->val << endl;

                if (node->left != nullptr)
                    q.push(node->left);

                if (node->right != nullptr)
                    q.push(node->right);
            }
        }


    }


    // Node* get(Node* parent, const string& childName) {
    //     if (parent->children.count(childName)) return parent->children[childName];
    //     Node* node = new Node(childName);
    //     parent->children[childName] = node;
    //     return node;
    // }
};
int main(){
    CrimeTree tree;

    ifstream ifs;
    return 0;
}