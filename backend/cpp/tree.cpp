//
// Created by Christopher Silva on 10/26/25.
//
#include "tree.h"
#include <bits/stdc++.h>
#include "json.hpp" // include nlohmann json library
using json = nlohmann::json; //Just for json abbreviation
using namespace std;

struct Node {
    string name;
    unordered_map<string, Node*> children;
    int count; //For records

    Node(const string& n = "") {
        name = n;
        count = 0;
    } 
};

class CrimeTree {
public:
    Node* root = new Node("root");

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
private:
    Node* get(Node* parent, const string& childName) {
        if (parent->children.count(childName)) return parent->children[childName];
        Node* node = new Node(childName);
        parent->children[childName] = node;
        return node;
    }
};
int main(){
    CrimeTree tree;
    return 0;
}